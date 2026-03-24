
import React from 'react';
import { motion } from 'framer-motion';
import Container from '../layout/Container';
import Card from '../ui/Card';
import { Translation } from '../../types';

interface AboutBriefProps {
  t: Translation;
}

const AboutBrief: React.FC<AboutBriefProps> = ({ t }) => {
  const items = [
    { title: t.whoWeAre, text: t.whoWeAreText, icon: 'users' },
    { title: t.whatWeBelieve, text: t.whatWeBelieveText, icon: 'heart' },
    { title: t.ourMission, text: t.ourMissionText, icon: 'cross' },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  return (
    <section id="about" className="py-24 md:py-32 bg-bg">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-serif text-4xl md:text-6xl font-medium text-text tracking-tight">
            {t.aboutBriefTitle}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item, index) => (
            <Card key={index} className="text-center p-10 border border-text/10 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* You can add icons here later */}
              <h3 className="font-serif text-2xl font-semibold text-text mt-4 mb-3">{item.title}</h3>
              <p className="text-text/70 font-light leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default AboutBrief;
