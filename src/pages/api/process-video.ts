import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface ProcessVideoRequest {
  url: string;
  interval: number;
  startTime: number;
  endTime?: number;
  licenseKey?: string; // Optional license key for tracking
}

interface ProcessVideoResponse {
  success: boolean;
  images?: string[];
  error?: string;
  message?: string;
  usageInfo?: {
    imagesGenerated: number;
    remainingImages: number;
  };
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

const TIMEOUT_MS = 300 * 1000; // 5 minutes timeout
const MAX_IMAGES = 100; // Prevent excessive memory usage

// Simple license validation (in production, validate against database)
function validateLicense(licenseKey?: string): { isValid: boolean; isPremium: boolean } {
  if (!licenseKey) {
    return { isValid: true, isPremium: false }; // Allow free usage
  }
  
  const isPremium = licenseKey.startsWith('PREMIUM-') && licenseKey.length > 20;
  return { isValid: true, isPremium };
}

function validateInput(data: any): ProcessVideoRequest {
  const { url, interval, startTime, endTime, licenseKey } = data;
  
  if (!url || typeof url !== 'string') {
    throw new Error('URL is required and must be a string');
  }
  
  if (!interval || typeof interval !== 'number' || interval <= 0) {
    throw new Error('Interval must be a positive number');
  }
  
  if (typeof startTime !== 'number' || startTime < 0) {
    throw new Error('Start time must be a non-negative number');
  }
  
  if (endTime !== undefined && (typeof endTime !== 'number' || endTime <= startTime)) {
    throw new Error('End time must be greater than start time');
  }
  
  return { url, interval, startTime, endTime, licenseKey };
}

// Helper function to find command in PATH or common installation locations
function findCommand(command: string): string {
  const { execSync } = require('child_process');
  
  // Check common installation paths
  const commonPaths = [
    path.join(os.homedir(), '.local/bin', command),
    '/usr/local/bin/' + command,
    '/usr/bin/' + command,
    '/bin/' + command,
  ];
  
  // Try to find in PATH first
  try {
    const whichPath = execSync(`which ${command}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
    if (whichPath) {
      return whichPath;
    }
  } catch {
    // Command not in PATH, continue to check common paths
  }
  
  // Check common installation locations
  for (const cmdPath of commonPaths) {
    if (fs.existsSync(cmdPath)) {
      return cmdPath;
    }
  }
  
  // Return original command (will fail with better error message)
  return command;
}

function spawnWithTimeout(command: string, args: string[], timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Find the actual command path (handles pipx and other installations)
    const commandPath = findCommand(command);
    
    // Prepare environment with pipx/local bin path included
    const env = {
      ...process.env,
      PATH: `${process.env.PATH || ''}:${os.homedir()}/.local/bin:/usr/local/bin:/usr/bin:/bin`,
    };
    
    const process = spawn(commandPath, args, {
      env,
      shell: false,
    });
    
    const timeout = setTimeout(() => {
      process.kill('SIGTERM');
      reject(new Error(`${command} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    process.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed with exit code ${code}`));
      }
    });
    
    process.on('error', (error) => {
      clearTimeout(timeout);
      const errorMsg = error.message.includes('ENOENT') 
        ? `${command} not found. Make sure it's installed and accessible. Checked: ${commandPath}`
        : `${command} failed to start: ${error.message}`;
      reject(new Error(errorMsg));
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ProcessVideoResponse>) {
  let tmpDir: string | null = null;
  
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false, 
        error: 'Method not allowed. Only POST requests are supported.' 
      });
    }

    // Validate and parse request body
    let requestData: ProcessVideoRequest;
    try {
      requestData = validateInput(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false, 
        error: `Invalid request data: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    const { url, interval, startTime, endTime, licenseKey } = requestData;
    
    // Validate license
    const { isValid, isPremium } = validateLicense(licenseKey);
    if (!isValid) {
      return res.status(403).json({
        success: false,
        error: 'Invalid license key'
      });
    }

    console.log(`Processing video: ${url}, interval: ${interval}s, start: ${startTime}s, end: ${endTime || 'N/A'}, license: ${isPremium ? 'premium' : 'free'}`);

    // Create temporary directory
    try {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'video-process-'));
      console.log(`Created temp directory: ${tmpDir}`);
    } catch (error) {
      throw new Error(`Failed to create temporary directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const videoPath = path.join(tmpDir, 'video.mp4');

    // Download video using yt-dlp
    console.log('Starting video download...');
    try {
      await spawnWithTimeout('yt-dlp', [
        '-f', 'best[ext=mp4]/best',
        '-o', videoPath,
        '--no-playlist', '--no-warnings',
        url
      ], TIMEOUT_MS);
      console.log('Video download completed');
    } catch (error) {
      throw new Error(`Failed to download video: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure yt-dlp is installed and the URL is valid.`);
    }

    // Verify video file exists and has content
    if (!fs.existsSync(videoPath) || fs.statSync(videoPath).size === 0) {
      throw new Error('Downloaded video file is empty or missing');
    }

    // Extract frames using ffmpeg
    console.log('Starting frame extraction...');
    const outputPattern = path.join(tmpDir, 'frame-%03d.png');
    const ffmpegArgs = [
      '-ss', startTime.toString(),
      ...(endTime ? ['-to', endTime.toString()] : []),
      '-i', videoPath,
      '-vf', `fps=1/${interval}`,
      '-y', // Overwrite output files
      outputPattern,
    ];

    try {
      await spawnWithTimeout('ffmpeg', ffmpegArgs, TIMEOUT_MS);
      console.log('Frame extraction completed');
    } catch (error) {
      throw new Error(`Failed to extract frames: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure ffmpeg is installed.`);
    }

    // Read all frames and encode as base64
    console.log('Processing extracted frames...');
    const images: string[] = [];
    try {
      const files = fs.readdirSync(tmpDir)
        .filter(f => f.startsWith('frame-') && f.endsWith('.png'))
        .sort(); // Ensure frames are in order

      if (files.length === 0) {
        throw new Error('No frames were extracted. Check if the video duration and time range are valid.');
      }

      // Apply limits for free users
      const maxImages = isPremium ? MAX_IMAGES : Math.min(MAX_IMAGES, 100); // Free users limited to 100
      if (files.length > maxImages) {
        console.warn(`Too many frames (${files.length}), limiting to ${maxImages}`);
        files.splice(maxImages);
      }

      for (const file of files) {
        const filePath = path.join(tmpDir, file);
        const img = fs.readFileSync(filePath);
        images.push(`data:image/png;base64,${img.toString('base64')}`);
      }

      console.log(`Successfully processed ${images.length} frames`);
    } catch (error) {
      throw new Error(`Failed to process frames: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Clean up temporary directory
    try {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        console.log('Cleaned up temporary directory');
      }
    } catch (error) {
      console.warn(`Failed to clean up temporary directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Calculate usage info
    const usageInfo = {
      imagesGenerated: images.length,
      remainingImages: isPremium ? -1 : Math.max(0, 100 - images.length), // Simplified calculation
    };

    return res.status(200).json({
      success: true,
      images,
      message: `Successfully extracted ${images.length} frames from video`,
      usageInfo,
    });

  } catch (error) {
    console.error('Error processing video:', error);
    
    // Clean up on error
    try {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        console.log('Cleaned up temporary directory after error');
      }
    } catch (cleanupError) {
      console.warn(`Failed to clean up after error: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown error'}`);
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while processing the video'
    });
  }
} 