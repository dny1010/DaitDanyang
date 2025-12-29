import React from "react";
import styles from "./EventGrid.module.css";
import { motion } from "framer-motion";

/**
 * EventGrid Component
 * - Displays a grid of event cards with animation.
 */
export default function EventGrid({ items }) {
  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <section className={styles.gridSection}>
      <motion.div 
        className={styles.grid}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {items.map((item) => (
          <motion.div 
            key={item.id} 
            className={styles.card}
            variants={itemAnim}
          >
            <div className={styles.cardBg} />
            <div className={styles.cardTitle}>{item.title}</div>
            <div className={styles.cardDate}>{item.date}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
