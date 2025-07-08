"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

// Input Component with Aceternity UI styling
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 text-sm placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 shadow-sm hover:shadow-md",
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});
Input.displayName = "Input";

// Label Component
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-gray-700 dark:text-gray-300 leading-none mb-2 block",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// Textarea Component
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        className={cn(
          "flex min-h-[120px] w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-lg px-4 py-3 text-sm placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 shadow-sm hover:shadow-md resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});
Textarea.displayName = "Textarea";

// Contact Info Card with Aceternity UI effects
const ContactInfoCard = ({ icon, title, content, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
            {content}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// Owner Profile Card
const OwnerProfileCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          JD
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          LOKENDRA KUMAR
        </h2>
        <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
          Co-founder & Devloper
        </p>
        
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
          <span className="text-sm">3rd year Student at IIT KANPUR </span>
        </div>
        <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-sm">IIT KANPUR ,Kalyanpur 208016</span>
        </div>
      </div>
    </motion.div>
  );
};

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Send a Message
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Have a question or want to discuss a project? Drop us a line!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your full name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="your.email@example.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="What's this about?"
            type="text"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us more about your inquiry..."
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg hover:shadow-xl"
          type="submit"
        >
          Send Message
        </motion.button>
      </form>
    </motion.div>
  );
};

// Main Contact Page Component
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-20"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's start a conversation.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Owner Profile */}
          <div className="lg:col-span-1">
            <OwnerProfileCard />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12"
          >
            Contact Information
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ContactInfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Email"
              content="lokendrak23@iitk.ac.in"
              description="Send us an email anytime"
            />
            
            <ContactInfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
              title="Phone"
              content="+91 8209237526"
              description="Mon-Fri 9AM-6PM PST"
            />
            
            <ContactInfoCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Office"
              content="HALL 12 IIT KANPUR"
              
            />
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ContactPage;
