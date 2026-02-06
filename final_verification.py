#!/usr/bin/env python3
"""
Final verification test to ensure all gallery APIs are working correctly
"""

import requests
import json

def final_verification():
    """Quick final verification of all major endpoints"""
    base_url = "https://igk-event-preview.preview.emergentagent.com/api"
    headers = {
        "Content-Type": "application/json",
        "x-admin-password": "admin123"
    }
    
    print("🔍 FINAL VERIFICATION TEST")
    print("=" * 40)
    
    # Test the core endpoints
    tests = [
        ("GET", "gallery/themes", None, "Public themes"),
        ("GET", "gallery/themes/holi-2024", None, "Theme by slug"),
        ("GET", "admin/gallery/themes", None, "Admin themes"),
        ("POST", "admin/gallery/themes", {
            "name": "Final Test Theme", 
            "description": "Quick verification", 
            "status": "published"
        }, "Create theme"),
    ]
    
    created_theme_id = None
    
    for method, endpoint, data, description in tests:
        url = f"{base_url}/{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=10)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=10)
            
            if response.status_code in [200, 201]:
                print(f"✅ {description}: {response.status_code}")
                if method == "POST" and "theme" in response.text:
                    resp_data = response.json()
                    created_theme_id = resp_data.get("theme", {}).get("id")
            else:
                print(f"❌ {description}: {response.status_code}")
                
        except Exception as e:
            print(f"💥 {description}: Error - {str(e)}")
    
    # Clean up created theme
    if created_theme_id:
        try:
            cleanup_url = f"{base_url}/admin/gallery/themes/{created_theme_id}"
            response = requests.delete(cleanup_url, headers=headers, timeout=10)
            print(f"🧹 Cleanup: {response.status_code}")
        except:
            print("🧹 Cleanup: Failed (non-critical)")

if __name__ == "__main__":
    final_verification()