

import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import Story from '../components/StoryCard';
import './Stories.css';

const Stories = () => {
  return (
    <>
    <Navbar />
    <Story />
    
    <Footer />
    </>
  )
}

export default Stories