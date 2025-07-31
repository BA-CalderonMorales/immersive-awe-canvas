/**
 * Example Usage of the Clean API Layered Architecture
 * 
 * This file demonstrates how to use the new layered server architecture
 */

import { 
    versionController, 
    loggingController, 
    sceneController,
    versionService,
    loggingService 
} from './index';

/**
 * Example: Version Management
 */
export async function exampleVersionUsage() {
    // Using the controller (for API endpoints)
    const versionInfo = await versionController.getVersion();
    console.log('Version Info:', versionInfo);

    // Get dynamic version from GitHub
    const dynamicVersion = await versionController.getDynamicVersion();
    console.log('Dynamic Version:', dynamicVersion);

    // Get all releases
    const releases = await versionController.getReleases(5);
    console.log('Recent Releases:', releases);

    // Using the service directly (for internal logic)
    const appVersion = versionService.getAppVersion();
    const buildInfo = versionService.getBuildInfo();
    console.log(`App Version: ${appVersion}, Build: ${buildInfo}`);
}

/**
 * Example: Logging System
 */
export async function exampleLoggingUsage() {
    // Log a user action
    const userActionResult = await loggingController.logUserAction(
        'scene_created',
        'user123',
        { sceneId: 'scene456', sceneName: 'My Awesome Scene' }
    );
    console.log('User Action Logged:', userActionResult);

    // Log an error
    const errorResult = await loggingController.logError(
        new Error('Something went wrong'),
        'client',
        { userId: 'user123', page: '/create-scene' }
    );
    console.log('Error Logged:', errorResult);

    // Log performance metric
    const perfResult = await loggingController.logPerformance(
        'scene_load_time',
        1234,
        'ms',
        { sceneId: 'scene456' }
    );
    console.log('Performance Logged:', perfResult);

    // Query recent logs
    const recentLogs = await loggingController.getRecentLogs(10);
    console.log('Recent Logs:', recentLogs);

    // Query logs by event type
    const userActionLogs = await loggingController.getLogsByEventType('user_action', 20);
    console.log('User Action Logs:', userActionLogs);
}

/**
 * Example: Scene Management
 */
export async function exampleSceneUsage() {
    // Create a new scene
    const newScene = await sceneController.createScene({
        name: 'My New Scene',
        description: 'A beautiful 3D scene',
        config: {
            background: 'gradient',
            lighting: 'soft',
            objects: ['cube', 'sphere']
        },
        is_public: true,
        created_by: 'user123'
    });
    console.log('Scene Created:', newScene);

    // Get public scenes
    const publicScenes = await sceneController.getPublicScenes(10);
    console.log('Public Scenes:', publicScenes);

    // Get user's scenes
    const userScenes = await sceneController.getUserScenes('user123', 10);
    console.log('User Scenes:', userScenes);

    // Like a scene
    if (newScene.success && newScene.data?.id) {
        const likeResult = await sceneController.likeScene('user456', newScene.data.id);
        console.log('Scene Liked:', likeResult);

        // Get user's liked scenes
        const likedScenes = await sceneController.getUserLikedScenes('user456');
        console.log('User Liked Scenes:', likedScenes);
    }
}

/**
 * Example: Error Handling Pattern
 */
export async function exampleErrorHandling() {
    try {
        // Try to get a non-existent scene
        const result = await sceneController.getScene(999999);
        
        if (!result.success) {
            // Log the error
            await loggingController.logError(
                `Failed to get scene: ${result.error}`,
                'server',
                { sceneId: 999999, operation: 'getScene' }
            );
            
            console.error('Scene not found:', result.error);
            return;
        }
        
        console.log('Scene found:', result.data);
    } catch (error) {
        // Log unexpected errors
        await loggingController.logError(
            error as Error,
            'server',
            { operation: 'exampleErrorHandling' }
        );
        
        console.error('Unexpected error:', error);
    }
}

/**
 * Example: Using Services Directly (for complex business logic)
 */
export async function exampleDirectServiceUsage() {
    // Use the service directly for complex operations
    const isLatest = await versionService.isCurrentVersionLatest();
    
    if (!isLatest) {
        // Log that we're not on the latest version
        await loggingService.logEvent({
            eventType: 'version_check',
            eventSource: 'server',
            metadata: {
                currentVersion: versionService.getAppVersion(),
                isLatest: false,
                checkTime: new Date().toISOString()
            }
        });
    }
    
    console.log('Is Latest Version:', isLatest);
}

/**
 * Initialize the server with startup logging
 */
export async function initializeServer() {
    try {
        // Log server startup
        await loggingController.logEvent({
            eventType: 'server_startup',
            eventSource: 'server',
            metadata: {
                version: versionService.getAppVersion(),
                buildInfo: versionService.getBuildInfo(),
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development'
            }
        });

        console.log('✅ Server initialized with Clean API architecture');
        console.log(`📦 Version: ${versionService.getFullVersion()}`);
        
    } catch (error) {
        console.error('❌ Failed to initialize server:', error);
        
        // Still try to log the error
        try {
            await loggingController.logError(
                error as Error,
                'server',
                { operation: 'server_initialization' }
            );
        } catch (logError) {
            console.error('Failed to log initialization error:', logError);
        }
    }
}

// Export all examples
export const examples = {
    version: exampleVersionUsage,
    logging: exampleLoggingUsage,
    scenes: exampleSceneUsage,
    errorHandling: exampleErrorHandling,
    directService: exampleDirectServiceUsage,
    initialize: initializeServer
};
