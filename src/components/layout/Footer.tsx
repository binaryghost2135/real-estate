import type { FC } from 'react';

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
      <div className="container mx-auto text-center">
        <p className="mb-4">&copy; {currentYear} HomeFind. All Rights Reserved.</p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-primary transition duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition duration-300">Terms of Service</a>
        </div>
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-primary transition duration-300">About</a>
          <a href="#" className="hover:text-primary transition duration-300">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
