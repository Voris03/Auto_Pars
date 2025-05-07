#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "Testing API endpoints..."

# Function to make requests and display response
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4

    echo -e "\nRequest:"
    echo "Method: $method"
    echo "Endpoint: $endpoint"
    if [ ! -z "$data" ]; then
        echo "Data: $data"
    fi
    if [ ! -z "$headers" ]; then
        echo "Headers: $headers"
    fi

    echo -e "\nResponse:"
    if [ ! -z "$data" ]; then
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    else
        response=$(curl -s -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            $headers)
    fi

    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo "----------------------------------------"
    echo "$response"
    return 0
}

# Test user registration
echo -e "\nTesting user registration..."
register_data='{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+7 (999) 123-45-67"
}'
register_response=$(curl -s -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d "$register_data")
echo "Registration Response:"
echo "$register_response" | jq '.' 2>/dev/null || echo "$register_response"

# Test login
echo -e "\nTesting login..."
login_data='{
    "email": "test@example.com",
    "password": "password123"
}'
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "$login_data")
echo "Login Response:"
echo "$login_response" | jq '.' 2>/dev/null || echo "$login_response"

# Extract token from login response
token=$(echo "$login_response" | jq -r '.access_token' 2>/dev/null)
echo "Extracted token: $token"
if [ -z "$token" ] || [ "$token" = "null" ]; then
    echo "Failed to get token from login response"
    exit 1
fi

# Test get user profile
echo -e "\nTesting get user profile..."
make_request "GET" "/auth/profile" "" "-H \"Authorization: Bearer $token\""

# Test create category
echo -e "\nTesting create category..."
category_data='{
    "name": "Test Category",
    "description": "Test Category Description",
    "image": "test-category.jpg"
}'
make_request "POST" "/categories" "$category_data" "-H \"Authorization: Bearer $token\""

# Test get categories
echo -e "\nTesting get categories..."
make_request "GET" "/categories" "" ""

# Test create product
echo -e "\nTesting create product..."
product_data='{
    "name": "Test Product",
    "description": "Test Description",
    "price": 1000,
    "brand": "Test Brand",
    "sku": "TEST123",
    "stock": 10,
    "categoryId": "1"
}'
make_request "POST" "/products" "$product_data" "-H \"Authorization: Bearer $token\""

# Test get products
echo -e "\nTesting get products..."
make_request "GET" "/products?page=1&limit=10" "" ""

# Test create request
echo -e "\nTesting create request..."
request_data='{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+7 (999) 123-45-67",
    "message": "This is a test request message with more than 10 characters"
}'
make_request "POST" "/requests" "$request_data" ""

# Test get requests
echo -e "\nTesting get requests..."
make_request "GET" "/requests" "" "-H \"Authorization: Bearer $token\""

echo -e "\nTesting completed!" 