from flask import jsonify
from app.models.story import Story
from app.models.charity import Charity
from app.services.database import db

class StoryController:
    @staticmethod
    def get_all_stories():
        stories = Story.query.all()
        return jsonify([story.to_dict() for story in stories])

    @staticmethod
    def get_story_by_id(story_id):
        story = Story.query.get(story_id)
        if story:
            return jsonify(story.to_dict())
        return jsonify({'message': 'Story not found'}), 404

    @staticmethod
    def create_story(charity_id, title, content):
        charity = Charity.query.get(charity_id)
        if not charity:
            return jsonify({'message': 'Charity not found'}), 404

        new_story = Story(charity_id=charity_id, title=title, content=content)
        db.session.add(new_story)
        db.session.commit()
        return jsonify({'message': 'Story created successfully', 'story': new_story.to_dict()}), 201

    @staticmethod
    def update_story(story_id, title=None, content=None):
        story = Story.query.get(story_id)
        if not story:
            return jsonify({'message': 'Story not found'}), 404

        if title: story.title = title
        if content: story.content = content
        db.session.commit()
        return jsonify({'message': 'Story updated successfully', 'story': story.to_dict()})

    @staticmethod
    def delete_story(story_id):
        story = Story.query.get(story_id)
        if not story:
            return jsonify({'message': 'Story not found'}), 404

        db.session.delete(story)
        db.session.commit()
        return jsonify({'message': 'Story deleted successfully'}), 200
