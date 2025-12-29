X posts                Reddit posts              Google Trends
   ↓                        ↓                         ↓
────────────────────────────────────────────────────────────
            Clean & normalize text (same rules)
────────────────────────────────────────────────────────────
   ↓                        ↓                         ↓
Sentiment analysis     Sentiment analysis          Attention score
Entity extraction      Entity extraction           Trend delta
Event keywords         Event keywords              Spike detection
   ↓                        ↓                         ↓
────────────────────────────────────────────────────────────
        Source weighting (X > Reddit > Trends)
────────────────────────────────────────────────────────────
   ↓
Weighted aggregation (time windows: 5m / 15m / 1h)
   ↓
────────────────────────────────────────────────────────────
                  Signal score
          (bullish / bearish / neutral)
────────────────────────────────────────────────────────────
   ↓
Price truth (for validation only)
   ↓
Backtest & refine
