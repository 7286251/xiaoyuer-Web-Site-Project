
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DeepAnalysisResult } from "../types";

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
        cn: { type: Type.STRING, description: "Chinese Master Prompt" },
        en: { type: Type.STRING, description: "English Master Prompt" }
      },
      required: ["cn", "en"]
    },
    platformMatrix: {
      type: Type.OBJECT,
      description: "Viral Copywriting for Major Platforms. Keep content punchy and concise.",
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
    fullCreativeScript: { type: Type.STRING, description: "Full creative spoken script" },
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
                cn: { type: Type.STRING, description: "Chinese visual description" },
                en: { type: Type.STRING, description: "English prompt" }
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

const DEEP_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    theme: { type: Type.STRING, description: "2. Content Core Theme" },
    consistency: { type: Type.STRING, description: "1. Character/Scene/Item Settings and Consistency" },
    bgm: { type: Type.STRING, description: "10. BGM Lyrics, Mood, Instruments" },
    shots: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          visual_atmosphere: { type: Type.STRING, description: "3. Style/Atmosphere/Tone/Light; 5. Specific Scene/Item details" },
          character_performance: { type: Type.STRING, description: "8. Appearance/Action/Expression; 5. Character specifics" },
          story_plot: { type: Type.STRING, description: "4. Story details; 6. Plot development & Dialogue" },
          camera_language: { type: Type.STRING, description: "9. Shot type, Angle, Movement" },
          audio_design: { type: Type.STRING, description: "7. SFX Analysis; 4. Audio details" },
        },
        required: ["timestamp", "visual_atmosphere", "character_performance", "story_plot", "camera_language", "audio_design"]
      }
    }
  },
  required: ["title", "theme", "consistency", "bgm", "shots"]
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
    // Minimal request with maxOutputTokens limit for speed
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hi",
      config: {
        maxOutputTokens: 1,
      }
    });
    return true;
  } catch (error) {
    console.warn("API Key Validation Failed:", error);
    return false;
  }
};

const prepareMediaPart = async (videoFile: File, ai: GoogleGenAI, onProgress: (msg: string, percent: number) => void) => {
    // Automatic Switching: Base64 for small files, File API for large files (>20MB)
    if (videoFile.size < MAX_INLINE_SIZE) {
        onProgress("小渝兒正在读取视频...", 10);
        const base64Data = await fileToBase64(videoFile);
        return { inlineData: { mimeType: videoFile.type, data: base64Data } };
    } else {
        onProgress("大文件检测：启动云端传输通道...", 10);
        
        // 1. Upload
        const uploadResult = await ai.files.upload({
           file: videoFile,
           config: { displayName: videoFile.name, mimeType: videoFile.type }
        });
        
        let file = uploadResult;
        console.log(`[Gemini Upload] URI: ${file.uri}, State: ${file.state}`);

        // 2. Poll for Active State with Adaptive Backoff (Optimized)
        let attempts = 0;
        const maxAttempts = 100;
        let delay = 500; // Start fast (500ms)

        while (file.state === 'PROCESSING') {
           attempts++;
           if (attempts > maxAttempts) throw new Error("Video processing timed out in cloud.");
           
           onProgress(`正在云端处理视频... ${attempts}s`, 10 + (attempts % 15));
           
           await new Promise(resolve => setTimeout(resolve, delay));
           
           // Adaptive: slow down if it takes longer to save API calls
           if (attempts > 5) delay = 1000;
           if (attempts > 15) delay = 2000;
           
           const getResult = await ai.files.get({ name: file.name });
           file = getResult;
        }

        if (file.state === 'FAILED') {
           throw new Error("Cloud video processing failed.");
        }

        onProgress("云端就绪，开始分析...", 20);
        return { fileData: { fileUri: file.uri, mimeType: file.mimeType } };
    }
};

export const analyzeVideoContent = async (
  videoFile: File,
  timeRange: { start: number, end: number } | null,
  resolution: string,
  onProgress: (msg: string, percent: number) => void,
  userApiKey?: string 
): Promise<AnalysisResult> => {
  
  const apiKey = userApiKey || process.env.API_KEY;
  if (!apiKey) throw new Error("No API Key found.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const mediaPart = await prepareMediaPart(videoFile, ai, onProgress);
    
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
      
      **PERFORMANCE CONSTRAINT**: 
      - Be CONCISE and DIRECT in all text fields. Avoid unnecessary filler words to ensure fast generation.
      - For 'platformMatrix', ensure high-impact, click-baity titles but keep the 'content' body punchy (under 200 words each).

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
         
         - **STRICT ANALYSIS INSTRUCTION (Apply this rigor to generated prompts)**:
           请详细分析这个视频的所有内容，包括：
           1. 角色\\场景\\物品设定和一致性；
           2. 内容核心主题；
           3. 每个镜头的画面风格、氛围、色调、光影、情绪；
           4. 每个镜头画面的故事内容细节、音效信息；
           5. 场景、物品、角色的具体信息；
           6. 每个镜头的内容、故事情节发展、台词对话；
           7. 音效分析描述；
           8. 人物外貌特征、行为动作、表情等详细信息；
           9. 镜头语言：景别、视角、运镜方式轨迹；
           10. 背景音乐的歌词内容、情绪风格、乐器演奏等。
           请按时间顺序详细描述每个镜头，不得遗漏任何内容细节，严格按照原视频内容进行分析，不得笼统概括。

         - **Quality Standards**:
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

export const analyzeDeepContent = async (
  videoFile: File,
  timeRange: { start: number, end: number } | null,
  onProgress: (msg: string, percent: number) => void,
  userApiKey?: string 
): Promise<DeepAnalysisResult> => {
  const apiKey = userApiKey || process.env.API_KEY;
  if (!apiKey) throw new Error("No API Key found.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const mediaPart = await prepareMediaPart(videoFile, ai, onProgress);
    
    onProgress("启动深度反推引擎...", 30);
    onProgress("正在进行10维度全息分析...", 50);

    let trimInstruction = "";
    if (timeRange) {
      trimInstruction = `Time limit: ${formatTimeForPrompt(timeRange.start)} to ${formatTimeForPrompt(timeRange.end)}`;
    }

    const promptText = `
      Role: Expert Video Analyst & Film Critic.
      Task: Perform a rigorous, strictly chronological, frame-by-frame DEEP ANALYSIS of the video content based on the following 10 dimensions. 
      
      **REQUIREMENTS**:
      - STRICTLY FOLLOW the original video content.
      - NO GENERALIZATIONS. Be extremely detailed.
      - Output Language: Simplified Chinese (简体中文).

      **10 DIMENSIONS OF ANALYSIS**:
      1. Character/Scene/Item Settings and Consistency.
      2. Content Core Theme.
      3. Visual Style (Atmosphere, Tone, Lighting, Mood) per shot.
      4. Story Details & Audio Info per shot.
      5. Specific Scene/Item/Character Details per shot.
      6. Plot Development & Dialogue per shot.
      7. Sound Effects Analysis.
      8. Character Appearance, Actions, Expressions per shot.
      9. Camera Language (Shot type, Angle, Movement).
      10. Background Music (Lyrics, Mood, Instruments).

      ${trimInstruction}
      
      Output strictly in JSON based on the provided schema. Ensure 'shots' array covers the entire video duration in sequence.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          mediaPart,
          { text: promptText }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: DEEP_ANALYSIS_SCHEMA,
        temperature: 0.4, // Lower temperature for stricter analysis
      }
    });

    onProgress("深度报告生成中...", 95);

    if (!response.text) throw new Error("No response from AI.");

    return JSON.parse(response.text) as DeepAnalysisResult;

  } catch (error) {
    console.error("Deep Analysis Error:", error);
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
