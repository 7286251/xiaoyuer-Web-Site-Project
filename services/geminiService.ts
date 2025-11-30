
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Removed global instance to allow dynamic key injection
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MAX_INLINE_SIZE = 20 * 1024 * 1024; // 20MB Threshold

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Internal ID or Short Title" },
    overallMood: { type: Type.STRING, description: "Style and Atmosphere Analysis" },
    recreationPrompt: {
      type: Type.OBJECT,
      properties: {
        cn: { type: Type.STRING, description: "Chinese Master Prompt for Recreation" },
        en: { type: Type.STRING, description: "English Master Prompt for Recreation (Sora/Runway optimized)" }
      },
      required: ["cn", "en"]
    },
    platformMatrix: {
      type: Type.OBJECT,
      description: "Viral Copywriting for Major Platforms (11 Platforms)",
      properties: {
        douyin: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        kuaishou: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        shipinhao: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        bilibili: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        youtube: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        tiktok: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        xigua: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        baijiahao: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        weibo: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        toutiao: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        },
        xiaohongshu: {
           type: Type.OBJECT, 
           properties: { title: {type: Type.STRING}, content: {type: Type.STRING}, hashtags: {type: Type.ARRAY, items: {type: Type.STRING}} },
           required: ["title", "content", "hashtags"]
        }
      },
      required: ["douyin", "kuaishou", "shipinhao", "bilibili", "youtube", "tiktok", "xigua", "baijiahao", "weibo", "toutiao", "xiaohongshu"]
    },
    fullCreativeScript: { type: Type.STRING, description: "Full creative spoken script for voiceover" },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          description: { type: Type.STRING },
          goldenHook: { type: Type.STRING, description: "Analysis of the 3-second hook" },
          characters: { type: Type.STRING },
          audio: { type: Type.STRING },
          originalScript: { type: Type.STRING },
          rewrittenScript: { type: Type.STRING },
          visualPrompt: { 
            type: Type.OBJECT,
            properties: {
                cn: { type: Type.STRING, description: "Detailed Chinese visual description for Domestic Models." },
                en: { type: Type.STRING, description: "High-fidelity English prompt (Midjourney/Flux style)." }
            },
            required: ["cn", "en"]
          },
        },
        required: ["timestamp", "description", "visualPrompt", "characters", "audio", "originalScript", "rewrittenScript", "goldenHook"]
      }
    }
  },
  required: ["title", "overallMood", "scenes", "recreationPrompt", "fullCreativeScript", "platformMatrix"]
};

const formatTimeForPrompt = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validates the API Key by making a minimal request
 */
export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) return false;
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Minimal request to test connectivity and auth
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "test",
    });
    return true;
  } catch (error) {
    console.warn("API Key Validation Failed:", error);
    return false;
  }
};

export const analyzeVideoContent = async (
  videoFile: File,
  timeRange: { start: number, end: number } | null,
  resolution: string,
  onProgress: (msg: string, percent: number) => void,
  userApiKey?: string 
): Promise<AnalysisResult> => {
  
  // Priority: User Provided Key > Env Variable
  const apiKey = userApiKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("No API Key found. Please enter your Google Gemini API Key.");
  }

  // Create instance with the specific key for this request
  const ai = new GoogleGenAI({ apiKey });

  try {
    let mediaPart: any;
    
    // Automatic Switching: Base64 for small files, File API for large files (>20MB)
    if (videoFile.size < MAX_INLINE_SIZE) {
        onProgress("小渝兒正在读取视频...", 10);
        const base64Data = await fileToBase64(videoFile);
        mediaPart = { inlineData: { mimeType: videoFile.type, data: base64Data } };
    } else {
        onProgress("大文件检测：启动云端传输通道...", 10);
        
        // 1. Upload
        const uploadResult = await ai.files.upload({
           file: videoFile,
           config: { displayName: videoFile.name, mimeType: videoFile.type }
        });
        
        let file = uploadResult;
        console.log(`[Gemini Upload] URI: ${file.uri}, State: ${file.state}`);

        // 2. Poll for Active State
        let attempts = 0;
        const maxAttempts = 60; // 2 minutes max wait
        
        while (file.state === 'PROCESSING') {
           attempts++;
           if (attempts > maxAttempts) throw new Error("Video processing timed out in cloud.");
           
           onProgress(`正在云端处理视频... ${attempts * 2}s`, 10 + (attempts % 10));
           await new Promise(resolve => setTimeout(resolve, 2000));
           
           const getResult = await ai.files.get({ name: file.name });
           file = getResult;
        }

        if (file.state === 'FAILED') {
           throw new Error("Cloud video processing failed.");
        }

        onProgress("云端就绪，开始分析...", 20);
        mediaPart = { fileData: { fileUri: file.uri, mimeType: file.mimeType } };
    }
    
    onProgress("启动全平台爆款分析引擎...", 30);
    const model = "gemini-2.5-flash"; 
    
    onProgress("正在进行全息视觉拆解与逆向推导...", 60);

    let trimInstruction = "";
    if (timeRange) {
      trimInstruction = `Time limit: ${formatTimeForPrompt(timeRange.start)} to ${formatTimeForPrompt(timeRange.end)}`;
    }

    const promptText = `
      Role: You are "Xiao Yu Er" (小渝兒), a top-tier viral video strategist AND an Expert Image Reverse Engineer.
      
      Task: Perform a deep frame-by-frame/scene-by-scene dismantling of the provided video content.
      
      **LANGUAGE REQUIREMENT**:
      - STRICTLY USE **SIMPLIFIED CHINESE (简体中文)** for all outputs, including Scene Descriptions, Scripts, Hooks, and Character Analysis.
      - The ONLY exception is 'visualPrompt.en', which must be in English.
      - 'visualPrompt.cn' must be in Chinese.
      - 'platformMatrix' content (Titles, Copy) must be in Chinese (except English hashtags for YouTube/TikTok if relevant).

      1. **SCENE BREAKDOWN (Frame-by-Frame Analysis)**:
         - Identify key visual changes and break the video into distinct scenes.
         - For each scene, provide a 'timestamp' and detailed 'description' (IN CHINESE).

      2. **VISUAL PROMPT REVERSE ENGINEERING (The Core Task)**:
         - You must generate a 'visualPrompt' that allows 100% reproduction of the frame's style and detail.
         - **Quality Standards**:
           - **Subject**: Detailed character features (age, outfit, texture, skin tone), poses, expressions, and interactions.
           - **Environment**: Specific background elements, weather, time of day (e.g. "Golden Hour", "Blue Hour"), spatial layout.
           - **Lighting & Color**: Explicitly define lighting types (e.g., "Rembrandt lighting", "Softbox", "Volumetric", "Cinematic"), Color grading (e.g. "Teal & Orange", "Desaturated", "Vibrant").
           
           - **visualPrompt.en (Midjourney/Flux/Sora)**:
             - **MUST INCLUDE EXPLICIT CAMERA ANGLES**: Use terms like 'Low-angle shot', 'Overhead view', 'High-angle shot', 'Eye-level shot', 'Dutch angle'.
             - **MUST INCLUDE EXPLICIT COMPOSITION**: Use terms like 'Rule of thirds', 'Centered composition', 'Symmetrical', 'Leading lines', 'Wide shot', 'Extreme close-up', 'Depth of field'.
             - Terminology must be professional photography/cinematography English.

           - **visualPrompt.cn (Domestic Models: Kling/Jimeng/CogVideo)**:
             - **MUST USE DOMESTIC OPTIMIZED KEYWORDS**: Use highly descriptive, atmospheric Chinese vocabulary that domestic models respond well to.
             - Keywords: "电影感", "光影细腻", "超高清", "氛围感拉满", "史诗感", "真实感", "大师级构图", "极致细节".
             - Focus on descriptive aesthetics over purely technical camera specs if that works better for domestic models, but keep the resolution high.

           - **Technical**: 
             - Camera (e.g., "Sony A7RIV", "Arri Alexa", "IMAX").
             - Lens (e.g., "35mm", "85mm f/1.8", "Anamorphic", "Macro").
             - Settings (e.g., "Bokeh", "Depth of field", "High contrast").
             - Resolution: ${resolution}, 8K, Ultra-detailed.
           - **Style**: Define the medium (e.g. "Photorealistic", "Oil Painting", "Anime", "3D Render").
      
      3. **VIRAL COPYWRITING**:
         - Generate platform-specific copy (Douyin, TikTok, etc.) based on the video's mood and content.
         - Analyze the 'Golden Hook' (first 3 seconds).
      
      4. **SCRIPT REWRITING**:
         - Extract original audio/script.
         - Create a 'rewrittenScript' for secondary creation.

      ${trimInstruction}
      
      Output strictly in JSON based on the defined schema.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          mediaPart,
          { text: promptText }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        temperature: 0.5,
      }
    });

    onProgress("解析完成，生成报告...", 95);

    if (!response.text) {
      throw new Error("No response from AI.");
    }

    const result: AnalysisResult = JSON.parse(response.text);
    return result;

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};
