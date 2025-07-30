from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from app.controllers.story_controller import StoryController
from app.middlewares.auth_middleware import roles_required
from flask_jwt_extended import get_jwt_identity
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
    @story_ns.doc('get_all_stories')
    @story_ns.marshal_list_with(story_response_model)
    def get(self):
        return StoryController.get_all_stories().json # Assuming controller returns jsonify

    @story_ns.doc('create_story')
    @story_ns.expect(story_request_model)
    @story_ns.marshal_with(story_response_model, code=201)
    @roles_required('charity')
    def post(self):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            story_ns.abort(404, message='Charity not found for this user')

        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        return StoryController.create_story(charity.id, title, content).json # Assuming controller returns jsonify

@story_ns.route('/<int:story_id>')
@story_ns.response(404, 'Story not found')
class Story(Resource):
    @story_ns.doc('get_story')
    @story_ns.marshal_with(story_response_model)
    def get(self, story_id):
        return StoryController.get_story_by_id(story_id).json # Assuming controller returns jsonify

    @story_ns.doc('update_story')
    @story_ns.expect(story_request_model)
    @story_ns.marshal_with(story_response_model)
    @roles_required('charity')
    def put(self, story_id):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            story_ns.abort(404, message='Charity not found for this user')

        story_response = StoryController.get_story_by_id(story_id)
        if story_response[1] != 200: # Check status code from jsonify response
            story_ns.abort(story_response[1], message=story_response[0].json['message'])
        story_data = story_response[0].json

        if story_data and story_data['charity_id'] != charity.id:
            story_ns.abort(403, message='Unauthorized to update this story')

        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        return StoryController.update_story(story_id, title, content).json # Assuming controller returns jsonify

    @story_ns.doc('delete_story')
    @story_ns.response(200, 'Story deleted successfully')
    @roles_required('charity')
    def delete(self, story_id):
        user_id = get_jwt_identity()
        charity = Charity.query.filter_by(owner_id=user_id).first()
        if not charity:
            story_ns.abort(404, message='Charity not found for this user')

        story_response = StoryController.get_story_by_id(story_id)
        if story_response[1] != 200:
            story_ns.abort(story_response[1], message=story_response[0].json['message'])
        story_data = story_response[0].json

        if story_data and story_data['charity_id'] != charity.id:
            story_ns.abort(403, message='Unauthorized to delete this story')

        return StoryController.delete_story(story_id).json # Assuming controller returns jsonify
