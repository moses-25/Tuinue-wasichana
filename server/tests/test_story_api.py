import pytest
import json

def test_get_all_stories(client, approved_charity, charity_user, app):
    """Test getting all stories"""
    # Create a story first
    with app.app_context():
        from app.models.story import Story
        from app.services.database import db
        
        story = Story(
            charity_id=approved_charity.id,
            title='Our Impact Story',
            content='This is how we helped the community...'
        )
        db.session.add(story)
        db.session.commit()
    
    response = client.get('/api/v1/stories/')
    
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 1
    assert data[0]['title'] == 'Our Impact Story'

def test_create_story_success(client, auth_headers_charity, approved_charity):
    """Test successful story creation"""
    response = client.post('/api/v1/stories/',
        headers=auth_headers_charity,
        json={
            'title': 'New Impact Story',
            'content': 'We recently helped 100 children with school supplies...'
        }
    )
    
    assert response.status_code == 201
    data = response.get_json()
    assert data['title'] == 'New Impact Story'
    assert data['charity_id'] == approved_charity.id

def test_create_story_missing_fields(client, auth_headers_charity):
    """Test story creation with missing fields"""
    response = client.post('/api/v1/stories/',
        headers=auth_headers_charity,
        json={
            'title': 'New Impact Story'
            # Missing content
        }
    )
    
    assert response.status_code == 400

def test_create_story_no_charity(client, auth_headers_donor):
    """Test story creation by user without charity"""
    response = client.post('/api/v1/stories/',
        headers=auth_headers_donor,
        json={
            'title': 'New Impact Story',
            'content': 'We recently helped 100 children...'
        }
    )
    
    assert response.status_code == 404

def test_get_story_by_id(client, approved_charity, app):
    """Test getting specific story by ID"""
    # Create a story first
    with app.app_context():
        from app.models.story import Story
        from app.services.database import db
        
        story = Story(
            charity_id=approved_charity.id,
            title='Our Impact Story',
            content='This is how we helped the community...'
        )
        db.session.add(story)
        db.session.commit()
        story_id = story.id
    
    response = client.get(f'/api/v1/stories/{story_id}')
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['title'] == 'Our Impact Story'

def test_get_story_not_found(client):
    """Test getting non-existent story"""
    response = client.get('/api/v1/stories/999')
    assert response.status_code == 404

def test_update_story_success(client, auth_headers_charity, approved_charity, app):
    """Test successful story update"""
    # Create a story first
    with app.app_context():
        from app.models.story import Story
        from app.services.database import db
        
        story = Story(
            charity_id=approved_charity.id,
            title='Original Title',
            content='Original content'
        )
        db.session.add(story)
        db.session.commit()
        story_id = story.id
    
    response = client.put(f'/api/v1/stories/{story_id}',
        headers=auth_headers_charity,
        json={
            'title': 'Updated Title',
            'content': 'Updated content'
        }
    )
    
    assert response.status_code == 200
    data = response.get_json()
    assert data['title'] == 'Updated Title'

def test_update_story_unauthorized(client, auth_headers_donor, approved_charity, app):
    """Test unauthorized story update"""
    # Create a story first
    with app.app_context():
        from app.models.story import Story
        from app.services.database import db
        
        story = Story(
            charity_id=approved_charity.id,
            title='Original Title',
            content='Original content'
        )
        db.session.add(story)
        db.session.commit()
        story_id = story.id
    
    response = client.put(f'/api/v1/stories/{story_id}',
        headers=auth_headers_donor,
        json={
            'title': 'Updated Title',
            'content': 'Updated content'
        }
    )
    
    assert response.status_code == 404  # No charity found for donor

def test_delete_story_success(client, auth_headers_charity, approved_charity, app):
    """Test successful story deletion"""
    # Create a story first
    with app.app_context():
        from app.models.story import Story
        from app.services.database import db
        
        story = Story(
            charity_id=approved_charity.id,
            title='Story to Delete',
            content='This story will be deleted'
        )
        db.session.add(story)
        db.session.commit()
        story_id = story.id
    
    response = client.delete(f'/api/v1/stories/{story_id}', headers=auth_headers_charity)
    
    assert response.status_code == 200
    data = response.get_json()
    assert 'Story deleted successfully' in data['message']

def test_unauthorized_story_access(client):
    """Test accessing story endpoints without authentication"""
    response = client.post('/api/v1/stories/',
        json={
            'title': 'New Story',
            'content': 'Story content'
        }
    )
    
    assert response.status_code == 401