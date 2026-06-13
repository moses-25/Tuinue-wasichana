#!/usr/bin/env python3
"""
Test runner script for Tuinue Wasichana API
"""
import pytest
import sys
import os

def run_all_tests():
    """Run all tests with coverage reporting"""
    print("🚀 Running Tuinue Wasichana API Tests...")
    print("=" * 50)
    
    # Test configuration
    test_args = [
        'tests/',
        '-v',  # Verbose output
        '--tb=short',  # Short traceback format
        '--strict-markers',  # Strict marker checking
        '--disable-warnings',  # Disable warnings for cleaner output
    ]
    
    # Run the tests
    exit_code = pytest.main(test_args)
    
    if exit_code == 0:
        print("\n✅ All tests passed successfully!")
    else:
        print(f"\n❌ Tests failed with exit code: {exit_code}")
    
    return exit_code

def run_specific_test_file(test_file):
    """Run tests from a specific file"""
    print(f"🧪 Running tests from: {test_file}")
    print("=" * 50)
    
    test_args = [
        f'tests/{test_file}',
        '-v',
        '--tb=short',
        '--disable-warnings',
    ]
    
    exit_code = pytest.main(test_args)
    return exit_code

def run_test_categories():
    """Run tests by category"""
    categories = {
        'auth': 'test_auth.py',
        'charity': 'test_charity_api.py',
        'donation': 'test_donation_api.py',
        'payment': 'test_payment_api.py',
        'story': 'test_story_api.py',
        'beneficiary': 'test_beneficiary_api.py',
        'inventory': 'test_inventory_api.py',
        'admin': 'test_admin_api.py'
    }
    
    print("📋 Available test categories:")
    for key, file in categories.items():
        print(f"  - {key}: {file}")
    
    choice = input("\nEnter category to test (or 'all' for all tests): ").strip().lower()
    
    if choice == 'all':
        return run_all_tests()
    elif choice in categories:
        return run_specific_test_file(categories[choice])
    else:
        print(f"❌ Invalid choice: {choice}")
        return 1

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Run specific test file if provided as argument
        test_file = sys.argv[1]
        if not test_file.endswith('.py'):
            test_file += '.py'
        exit_code = run_specific_test_file(test_file)
    else:
        # Interactive mode
        exit_code = run_test_categories()
    
    sys.exit(exit_code)