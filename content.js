// Sentiment analysis helper function
function analyzeSentiment(text) {
    // Simple sentiment analysis based on positive and negative word lists
    const positiveWords = new Set([
        'good', 'great', 'awesome', 'excellent', 'amazing', 'love', 'best', 'fantastic',
        'wonderful', 'perfect', 'helpful', 'beautiful', 'thanks', 'thank you'
    ]);
    
    const negativeWords = new Set([
        'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing',
        'waste', 'useless', 'stupid', 'boring', 'dislike'
    ]);

    const words = text.toLowerCase().split(/\s+/);
    let score = 0;
    
    words.forEach(word => {
        if (positiveWords.has(word)) score++;
        if (negativeWords.has(word)) score--;
    });

    return score;
}

// Function to get sentiment color
function getSentimentColor(score) {
    if (score > 0) return '#4CAF50'; // Green
    if (score < 0) return '#F44336'; // Red
    return '#FFC107'; // Yellow
}

// Function to create and insert sentiment display
function createSentimentDisplay() {
    const commentsSection = document.getElementById('comments');
    if (!commentsSection) return;

    // Create sentiment display container
    const sentimentContainer = document.createElement('div');
    sentimentContainer.id = 'yt-sentiment-container';
    sentimentContainer.style.padding = '10px';
    sentimentContainer.style.margin = '10px 0';
    sentimentContainer.style.borderRadius = '8px';
    sentimentContainer.style.backgroundColor = '#f9f9f9';
    sentimentContainer.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

    // Insert before comments section
    commentsSection.parentNode.insertBefore(sentimentContainer, commentsSection);

    return sentimentContainer;
}

// Function to analyze comments and update display
function analyzeComments() {
    const comments = document.querySelectorAll('#content-text');
    let totalScore = 0;
    let commentCount = 0;

    comments.forEach(comment => {
        const score = analyzeSentiment(comment.textContent);
        totalScore += score;
        commentCount++;
    });

    const averageScore = commentCount > 0 ? totalScore / commentCount : 0;
    const sentimentColor = getSentimentColor(averageScore);
    
    let container = document.getElementById('yt-sentiment-container');
    if (!container) {
        container = createSentimentDisplay();
    }

    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${sentimentColor};"></div>
            <div>
                <strong>Comment Sentiment:</strong> 
                ${averageScore > 0 ? 'Positive' : averageScore < 0 ? 'Negative' : 'Neutral'}
                (Based on ${commentCount} comments)
            </div>
        </div>
    `;
}

// Observer to watch for comment section changes
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            analyzeComments();
        }
    }
});

// Function to initialize the extension
function init() {
    // Wait for comments section to load
    const checkForComments = setInterval(() => {
        const commentsSection = document.getElementById('comments');
        if (commentsSection) {
            clearInterval(checkForComments);
            analyzeComments();
            
            // Start observing changes
            observer.observe(commentsSection, {
                childList: true,
                subtree: true
            });
        }
    }, 1000);
}

// Initialize when URL changes (for YouTube's SPA behavior)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        init();
    }
}).observe(document, { subtree: true, childList: true });

// Initial load
init(); 