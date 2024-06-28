import React from 'react'
import { motion } from 'framer-motion';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const DasboardCard = ({ id, title, description, imageUrl, color, onClick  }) => {    
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card onClick={() => onClick(id)} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', height: '100%', backgroundColor: color, padding: '10px', borderRadius: '50px', }}>
          <CardActionArea sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch' }}>
              <CardMedia
                  component="img"
                  sx={{ width: { xs: '100%', md: '40%' }, height: { xs: 'auto', md: '100%' }, objectFit: 'cover', borderRadius: '50px', }}
                  image={imageUrl}
                  alt={title}
              />
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px' }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ color: '#000' }}>
                      {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ color: '#000' }}>
                      {description}
                  </Typography>
              </CardContent>
          </CardActionArea>
      </Card>
    </motion.div>
  )
}

export default DasboardCard