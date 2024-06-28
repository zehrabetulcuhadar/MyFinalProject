import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import cards from './../data/card';
import CopyrigthBar from './../components/CopyrightBar'

const Article = () => {
    const { cardId } = useParams();
    const [content, setContent] = useState({ title: '', description: '', details: '', imageUrl: '', color: '' });
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const card = cards.find(card => card.id === parseInt(cardId));
        if (card) {
          setContent({ title: card.title, description: card.description, details: card.details, imageUrl: card.imageUrl, color: card.color });
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [cardId]);

    const articleStyle = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '60px',
            minHeight: 'calc(100vh - 60px)',
            width: '100%',
            marginBottom: '60px',
        },
        mainContent: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: content.color,
            borderRadius: '20px',
            padding: '20px',
            width: '80%',
            boxSizing: 'border-box',
        },
        contentBlock: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
        },
        image: {
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
        },
        textContainer: {
            textAlign: 'center',
        },
        header: {
            fontSize: '1.5rem',
            color: '#2d3e50',
            margin: '10px 0',
        },
        paragraph: {
            lineHeight: '1.5',
            fontSize: '1.1rem',
            marginBottom: '20px',
        },
        details: {
            fontSize: '1rem',
            color: '#000',
            background: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '100%',
            alignSelf: 'flex-start', 
        }
    };

  return (
    <div>
        <DashboardNavbar />
        <div style={articleStyle.container}>
            <div style={articleStyle.mainContent}>
                <div style={articleStyle.contentBlock}>
                    <img src={content.imageUrl} alt={content.title} style={articleStyle.image} />
                    <h1 style={articleStyle.header}>{content.title}</h1>
                    <p style={articleStyle.paragraph}>{content.description}</p>
                </div>
                <div style={articleStyle.details} dangerouslySetInnerHTML={{ __html: content.details }} />
            </div>
        </div>
        <CopyrigthBar />
    </div>
    );
}

export default Article