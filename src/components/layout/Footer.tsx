
import type { FC } from 'react';

interface FooterProps {
  onOpenLoginModal: () => void;
}

const Footer: FC<FooterProps> = ({ onOpenLoginModal }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
      <div className="container mx-auto text-center">
        <p className="mb-4">&copy; {currentYear} HomeFind. All Rights Reserved.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
          <a href="#" className="hover:text-primary transition duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition duration-300">Terms of Service</a>
          <a href="#" className="hover:text-primary transition duration-300">About</a>
          <a href="#" className="hover:text-primary transition duration-300">Contact</a>
        </div>
        <div>
          <button onClick={onOpenLoginModal} className="hover:text-primary transition duration-300 text-sm">
            Admin Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
