// Performance Monitor for EDU-MORPH Document AI System
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            documentProcessing: [],
            aiGeneration: [],
            fileUploads: [],
            userInteractions: []
        };
        this.startTime = Date.now();
        this.isEnabled = true;
    }

    // Start timing an operation
    startTimer(operation) {
        if (!this.isEnabled) return null;
        
        const timer = {
            operation: operation,
            startTime: performance.now(),
            id: Date.now() + Math.random()
        };
        
        return timer;
    }

    // End timing an operation
    endTimer(timer) {
        if (!timer || !this.isEnabled) return;
        
        const duration = performance.now() - timer.startTime;
        const metric = {
            operation: timer.operation,
            duration: duration,
            timestamp: new Date(),
            id: timer.id
        };
        
        this.metrics[timer.operation] = this.metrics[timer.operation] || [];
        this.metrics[timer.operation].push(metric);
        
        // Keep only last 100 metrics per operation
        if (this.metrics[timer.operation].length > 100) {
            this.metrics[timer.operation] = this.metrics[timer.operation].slice(-100);
        }
        
        return metric;
    }

    // Get performance statistics
    getStats(operation = null) {
        if (operation) {
            return this.calculateStats(this.metrics[operation] || []);
        }
        
        const allStats = {};
        Object.keys(this.metrics).forEach(op => {
            allStats[op] = this.calculateStats(this.metrics[op]);
        });
        
        return allStats;
    }

    // Calculate statistics for a set of metrics
    calculateStats(metrics) {
        if (metrics.length === 0) {
            return {
                count: 0,
                average: 0,
                min: 0,
                max: 0,
                median: 0
            };
        }
        
        const durations = metrics.map(m => m.duration);
        durations.sort((a, b) => a - b);
        
        return {
            count: durations.length,
            average: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            median: durations[Math.floor(durations.length / 2)]
        };
    }

    // Monitor document processing
    monitorDocumentProcessing(file, callback) {
        const timer = this.startTimer('documentProcessing');
        
        return callback().then(result => {
            const metric = this.endTimer(timer);
            metric.fileSize = file.size;
            metric.fileType = file.type;
            metric.success = true;
            return result;
        }).catch(error => {
            const metric = this.endTimer(timer);
            metric.fileSize = file.size;
            metric.fileType = file.type;
            metric.success = false;
            metric.error = error.message;
            throw error;
        });
    }

    // Monitor AI generation
    monitorAIGeneration(options, callback) {
        const timer = this.startTimer('aiGeneration');
        
        return callback().then(result => {
            const metric = this.endTimer(timer);
            metric.contentType = options.contentType;
            metric.difficulty = options.difficulty;
            metric.count = options.count;
            metric.success = true;
            metric.generatedItems = result ? result.length : 0;
            return result;
        }).catch(error => {
            const metric = this.endTimer(timer);
            metric.contentType = options.contentType;
            metric.difficulty = options.difficulty;
            metric.count = options.count;
            metric.success = false;
            metric.error = error.message;
            throw error;
        });
    }

    // Monitor file uploads
    monitorFileUpload(file, callback) {
        const timer = this.startTimer('fileUploads');
        
        return callback().then(result => {
            const metric = this.endTimer(timer);
            metric.fileSize = file.size;
            metric.fileType = file.type;
            metric.success = true;
            return result;
        }).catch(error => {
            const metric = this.endTimer(timer);
            metric.fileSize = file.size;
            metric.fileType = file.type;
            metric.success = false;
            metric.error = error.message;
            throw error;
        });
    }

    // Get performance recommendations
    getRecommendations() {
        const stats = this.getStats();
        const recommendations = [];
        
        // Document processing recommendations
        const docStats = stats.documentProcessing;
        if (docStats.count > 0) {
            if (docStats.average > 5000) {
                recommendations.push({
                    type: 'performance',
                    message: 'Document processing is slow. Consider using smaller files or optimizing extraction.',
                    severity: 'warning'
                });
            }
            
            if (docStats.max > 30000) {
                recommendations.push({
                    type: 'performance',
                    message: 'Some documents take very long to process. Consider adding file size limits.',
                    severity: 'error'
                });
            }
        }
        
        // AI generation recommendations
        const aiStats = stats.aiGeneration;
        if (aiStats.count > 0) {
            if (aiStats.average > 10000) {
                recommendations.push({
                    type: 'performance',
                    message: 'AI generation is slow. Consider reducing content count or using faster models.',
                    severity: 'warning'
                });
            }
            
            const successRate = this.metrics.aiGeneration.filter(m => m.success).length / this.metrics.aiGeneration.length;
            if (successRate < 0.8) {
                recommendations.push({
                    type: 'reliability',
                    message: 'AI generation has low success rate. Check API configuration and network.',
                    severity: 'error'
                });
            }
        }
        
        return recommendations;
    }

    // Export metrics for analysis
    exportMetrics() {
        return {
            sessionStart: this.startTime,
            sessionDuration: Date.now() - this.startTime,
            metrics: this.metrics,
            stats: this.getStats(),
            recommendations: this.getRecommendations()
        };
    }

    // Clear all metrics
    clearMetrics() {
        Object.keys(this.metrics).forEach(key => {
            this.metrics[key] = [];
        });
        this.startTime = Date.now();
    }

    // Enable/disable monitoring
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    // Get real-time performance dashboard data
    getDashboardData() {
        const stats = this.getStats();
        const recommendations = this.getRecommendations();
        
        return {
            overview: {
                totalOperations: Object.values(stats).reduce((sum, stat) => sum + stat.count, 0),
                averageResponseTime: this.calculateOverallAverage(stats),
                successRate: this.calculateSuccessRate(),
                uptime: Date.now() - this.startTime
            },
            byOperation: stats,
            recommendations: recommendations,
            recentActivity: this.getRecentActivity()
        };
    }

    calculateOverallAverage(stats) {
        const allDurations = [];
        Object.values(stats).forEach(stat => {
            if (stat.count > 0) {
                allDurations.push(stat.average);
            }
        });
        
        return allDurations.length > 0 
            ? allDurations.reduce((a, b) => a + b, 0) / allDurations.length 
            : 0;
    }

    calculateSuccessRate() {
        const allMetrics = Object.values(this.metrics).flat();
        if (allMetrics.length === 0) return 100;
        
        const successful = allMetrics.filter(m => m.success !== false).length;
        return (successful / allMetrics.length) * 100;
    }

    getRecentActivity() {
        const allMetrics = Object.values(this.metrics).flat();
        return allMetrics
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} else {
    window.PerformanceMonitor = PerformanceMonitor;
}
