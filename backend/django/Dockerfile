FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files
# RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
