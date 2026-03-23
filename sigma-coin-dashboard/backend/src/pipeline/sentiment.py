from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# 1. Initialize the AI Scout
analyzer = SentimentIntensityAnalyzer()

def analyze_post_alpha(text):
    """
    Turns any raw social post into a mathematical sentiment signal.
    """
    if not text:
        return 'neutral', 0.0

    # 2. Extract the Polarity Scores
    # VADER returns a dictionary: {'pos': 0.1, 'neu': 0.8, 'neg': 0.1, 'compound': 0.45}
    scores = analyzer.polarity_scores(text)
    
    # 3. Focus on the "Compound" metric (the most important 'Alpha' field)
    compound = scores['compound']
    
    # 4. Map the signal into Sigma Categories
    if compound >= 0.05:
        sentiment = 'positive'  # BULLISH (Hype detected)
    elif compound <= -0.05:
        sentiment = 'negative'  # BEARISH (FUD detected)
    else:
        sentiment = 'neutral'   # STABLE (White noise)
        
    return sentiment, round(compound, 4)

if __name__ == "__main__":
    # Example Usage:
    text = "PEPE TO THE MOON! 🚀🚀🚀"
    label, score = analyze_post_alpha(text)
    print(f"Result: ({label}, {score})")
