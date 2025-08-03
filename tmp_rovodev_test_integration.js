// Test script to check backend integration
const API_BASE_URL = 'https://tuinue-wasichana-api-amem.onrender.com/api/v1';

async function testBackendEndpoints() {
  console.log('Testing backend integration...\n');
  
  // Test health endpoint
  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test charities endpoint
  try {
    const charitiesResponse = await fetch(`${API_BASE_URL}/charities/`);
    const charitiesData = await charitiesResponse.json();
    console.log('✅ Charities endpoint:', charitiesData);
  } catch (error) {
    console.log('❌ Charities endpoint failed:', error.message);
  }
  
  // Test stories endpoint
  try {
    const storiesResponse = await fetch(`${API_BASE_URL}/stories/`);
    const storiesData = await storiesResponse.json();
    console.log('✅ Stories endpoint:', storiesData);
  } catch (error) {
    console.log('❌ Stories endpoint failed:', error.message);
  }
}

testBackendEndpoints();