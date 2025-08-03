#!/usr/bin/env python3
"""
Test the default value extraction fix
"""

import sys
import os

# Add the Backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_default_extraction():
    """Test the default value extraction method"""
    from database_migrator import DatabaseMigrator
    
    # Create a migrator instance without connecting to DB
    class TestMigrator(DatabaseMigrator):
        def __init__(self):
            # Skip database connection for testing
            pass
    
    migrator = TestMigrator()
    
    print("🧪 Testing Default Value Extraction")
    print("=" * 40)
    
    # Test cases that were causing the error
    test_cases = [
        {
            'input': "ColumnDefault('Kenya')",
            'pg_type': 'VARCHAR(100)',
            'expected': "'Kenya'"
        },
        {
            'input': "ColumnDefault('Health')",
            'pg_type': 'VARCHAR(100)',
            'expected': "'Health'"
        },
        {
            'input': "ColumnDefault(10000)",
            'pg_type': 'INTEGER',
            'expected': '10000'
        },
        {
            'input': "'direct_string'",
            'pg_type': 'VARCHAR(100)',
            'expected': "'direct_string'"
        },
        {
            'input': "12345",
            'pg_type': 'INTEGER',
            'expected': '12345'
        },
        {
            'input': "None",
            'pg_type': 'VARCHAR(100)',
            'expected': "''"
        }
    ]
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            result = migrator.extract_default_value(test_case['input'], test_case['pg_type'])
            if result == test_case['expected']:
                print(f"   ✅ Test {i}: {test_case['input']} → {result}")
            else:
                print(f"   ❌ Test {i}: {test_case['input']} → {result} (expected {test_case['expected']})")
                all_passed = False
        except Exception as e:
            print(f"   ❌ Test {i}: {test_case['input']} → ERROR: {e}")
            all_passed = False
    
    if all_passed:
        print("\n✅ All default value extraction tests passed!")
        print("\n🎉 The migration system will now correctly handle:")
        print("   - ColumnDefault('Kenya') → 'Kenya'")
        print("   - ColumnDefault('Health') → 'Health'") 
        print("   - ColumnDefault(10000) → 10000")
        print("\n🚀 Ready for deployment!")
    else:
        print("\n❌ Some tests failed!")
    
    return all_passed

if __name__ == '__main__':
    test_default_extraction()