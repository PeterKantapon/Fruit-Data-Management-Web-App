@echo off
echo 🚀 Starting Fruit Management Development Environment...
echo.

echo 📦 Stopping any existing containers...
docker-compose -f docker-compose.dev.yml down

echo 🔨 Building and starting services...
docker-compose -f docker-compose.dev.yml up --build -d

echo ⏳ Waiting for services to be ready...
timeout /t 15

echo.
echo ✅ Development environment is ready!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔗 Backend:  http://localhost:3001
echo 🗄️  Database: localhost:5433
echo.
echo 👤 Login credentials:
echo Username: admin
echo Password: admin123
echo.
echo 📋 Useful commands:
echo   docker-compose -f docker-compose.dev.yml logs -f     (view logs)
echo   docker-compose -f docker-compose.dev.yml down        (stop all)
echo   docker-compose -f docker-compose.dev.yml restart     (restart)
echo.
pause