import React from 'react';
import './AboutUs.css';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="about-us">
        <h1>About Us</h1>
        <p>
          Welcome to Detritus!
          <p>
            At Detritus, we believe in giving new life to old treasures. Our platform connects sellers who want to part 
            with their pre-loved items with buyers who see the value in second-hand goods. Whether you’re looking to declutter your 
            home or find a unique item at a great price, Detritus is here to make the process easy and enjoyable.
          </p>
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to create a sustainable marketplace where second-hand items can find new homes. 
          <p>
            We aim to reduce waste and promote a circular economy by encouraging the reuse and recycling of products.
          </p>
        </p>
        <h2>What We Offer</h2>
        <div className="team">
          <div className="team-member">
            <h3>Diverse Listings</h3>
            <p>
              From vintage furniture to gently used electronics, our marketplace offers a wide range of products.
            </p>
          </div>
        
          <div className="team-member">
            <h3>Community Focus</h3>
            <p>
              Detritus is more than just a marketplace; it’s a community of like-minded individuals who value sustainability and smart shopping.
            </p>      
          </div>
        </div>
        <p></p>
        <h2>Our Story</h2>
        <p>
          Detritus was founded with the vision of transforming the way people buy and sell second-hand items. 
          We noticed a growing need for a reliable platform where users could easily connect and trade their goods. Since our launch, 
          we’ve helped countless items find new homes and have built a community of satisfied users.
        </p>
        <p></p>
        <h2>Why Choose Us?</h2>
        <div className="team">
          <div className="team-member">
            <h3>User-Friendly Interface</h3>
            <p>
              Our website is designed to be intuitive and easy to navigate.
            </p>
          </div>
          <div className="team-member">
            <h3>Customer Support</h3>
            <p>
              Our dedicated support team is always here to help with any questions or concerns.
            </p>
          </div>
          <div className="team-member">
            <h3>Eco-Friendly</h3>
            <p>
              By choosing to buy and sell on Detritus, you’re making a positive impact on the environment.
            </p>      
          </div>
        </div>
        <p>
          Join us in our mission to make second-hand the first choice. Explore our marketplace today and discover the hidden gems waiting for you!
        </p>


        {/* Contact Details Section */}
        <h2>Contact Us</h2>
        <div className="contact-details">
          <p>Email: <a href="mailto:detritus408@gmail.com">detritus408@gmail.com</a></p>
          <p>Phone: <a href="tel://7044373952">+91 7044373952</a></p>
        </div>
        <p>
          Owner - <b>Aritra Deb</b>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
