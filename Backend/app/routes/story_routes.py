from flask import request
from flask_restx import Namespace, Resource, fields
from app.controllers.story_controller import StoryController
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.models.charity import Charity

story_ns = Namespace('stories', description='Story related operations')

story_request_model = story_ns.model('StoryRequest', {
    'title': fields.String(required=True, description='Story title'),
    'content': fields.String(required=True, description='Story content')
})

story_response_model = story_ns.model('StoryResponse', {
    'id': fields.Integer(readOnly=True),
    'charity_id': fields.Integer,
    'title': fields.String,
    'content': fields.String,
    'created_at': fields.DateTime
})

@story_ns.route('/')
class StoryList(Resource):
    def get(self):
        stories = StoryController.get_all_stories()
        return {
            'success': True,
            'stories': [s.to_dict() for s in stories],
            'message': 'Stories retrieved successfully.'
        }, 200

    @story_ns.expect(story_request_model)
    @jwt_required()
    @roles_required('charity')
    def post(self):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            return {'success': False, 'error': 'Charity not found for this user'}, 404
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        story = StoryController.create_story(charity.id, title, content)
        return {
            'success': True,
            'story': story.to_dict(),
            'message': 'Story created successfully.'
        }, 201

@story_ns.route('/<int:story_id>')
class Story(Resource):
    def get(self, story_id):
        story = StoryController.get_story_by_id(story_id)
        if not story:
            return {'success': False, 'error': 'Story not found'}, 404
        return {
            'success': True,
            'story': story.to_dict(),
            'message': 'Story retrieved successfully.'
        }, 200

    @story_ns.expect(story_request_model)
    @jwt_required()
    @roles_required('charity')
    def put(self, story_id):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            return {'success': False, 'error': 'Charity not found for this user'}, 404
        story = StoryController.get_story_by_id(story_id)
        if not story or story.charity_id != charity.id:
            return {'success': False, 'error': 'Unauthorized to update this story'}, 403
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        updated_story = StoryController.update_story(story_id, title, content)
        return {
            'success': True,
            'story': updated_story.to_dict(),
            'message': 'Story updated successfully.'
        }, 200

    @jwt_required()
    @roles_required('charity')
    def delete(self, story_id):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            return {'success': False, 'error': 'Charity not found for this user'}, 404
        story = StoryController.get_story_by_id(story_id)
        if not story or story.charity_id != charity.id:
            return {'success': False, 'error': 'Unauthorized to delete this story'}, 403
        StoryController.delete_story(story_id)
        return {
            'success': True,
            'message': 'Story deleted successfully.'
        }, 200
