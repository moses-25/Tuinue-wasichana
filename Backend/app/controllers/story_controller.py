from flask import jsonify
from app.models.story import Story
from app.models.charity import Charity
from app.services.database import db

class StoryController:
    @staticmethod
    def get_all_stories():
        stories = Story.query.all()
        return stories  # Return the actual list, not jsonify

    @staticmethod
    def get_story_by_id(story_id):
        story = Story.query.get(story_id)
        return story  # Return the actual story object, not jsonify

    @staticmethod
    def create_story(charity_id, title, content):
        charity = Charity.query.get(charity_id)
        if not charity:
            return None

        new_story = Story(charity_id=charity_id, title=title, content=content)
        db.session.add(new_story)
        db.session.commit()
        return new_story

    @staticmethod
    def update_story(story_id, title=None, content=None):
        story = Story.query.get(story_id)
        if not story:
            return None

        if title: story.title = title
        if content: story.content = content
        db.session.commit()
        return story

    @staticmethod
    def delete_story(story_id):
        story = Story.query.get(story_id)
        if not story:
            return False

        db.session.delete(story)
        db.session.commit()
        return True
