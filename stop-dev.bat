#!/bin/bash
echo "🛑 Stopping Fruit Management Development Environment..."
docker-compose -f docker-compose.dev.yml down
echo "✅ All services stopped!"