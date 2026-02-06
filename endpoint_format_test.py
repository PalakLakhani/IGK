#!/usr/bin/env python3
"""
Additional test to check the exact endpoint formats mentioned in the requirements
vs what's actually implemented.
"""

import requests
import json

def test_exact_endpoints():
    """Test the exact endpoint formats mentioned in requirements"""
    base_url = "https://igk-event-preview.preview.emergentagent.com/api"
    headers = {
        "Content-Type": "application/json",
        "x-admin-password": "admin123"
    }
    
    print("🔍 Testing exact endpoint formats from requirements:")
    print("=" * 60)
    
    # Test 1: Check if /api/admin/gallery-themes works vs /api/admin/gallery/themes
    endpoints_to_test = [
        ("GET", "admin/gallery-themes", "Admin themes with dash"),
        ("GET", "admin/gallery/themes", "Admin themes with slash"),
        ("GET", "admin/gallery-photos?themeId=test", "Admin photos with dash"),
        ("GET", "admin/gallery/photos?themeId=test", "Admin photos with slash"),
    ]
    
    for method, endpoint, description in endpoints_to_test:
        url = f"{base_url}/{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=10)
            
            print(f"{description}: {response.status_code}")
            if response.status_code == 404:
                print(f"  ❌ Not found: {endpoint}")
            elif response.status_code == 200:
                print(f"  ✅ Working: {endpoint}")
            else:
                print(f"  ⚠️  Status {response.status_code}: {endpoint}")
                
        except Exception as e:
            print(f"  💥 Error: {endpoint} - {str(e)}")
    
    print("\n📝 ENDPOINT FORMAT ANALYSIS:")
    print("Requirements mentioned these formats:")
    print("  - GET /api/admin/gallery-themes")
    print("  - POST /api/admin/gallery-themes") 
    print("  - PUT /api/admin/gallery-themes/[id]")
    print("  - DELETE /api/admin/gallery-themes/[id]")
    print("  - GET /api/admin/gallery-photos?themeId=[id]")
    print("  - POST /api/admin/gallery-photos")
    print("  - DELETE /api/admin/gallery-photos/[id]")
    
    print("\nActual implemented formats:")
    print("  - GET /api/admin/gallery/themes")
    print("  - POST /api/admin/gallery/themes")
    print("  - PUT /api/admin/gallery/themes/[id]")
    print("  - DELETE /api/admin/gallery/themes/[id]")
    print("  - GET /api/admin/gallery/themes/[id]/photos") 
    print("  - POST /api/admin/gallery/themes/[id]/photos (bulk)")
    print("  - DELETE /api/admin/gallery/photos/[id]")

if __name__ == "__main__":
    test_exact_endpoints()