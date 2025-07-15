// components/Modal.tsx

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-[500px]"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on content click
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl mb-4 text-center">Sign up as..</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Brand Block */}
              <a
                href="/signup/creator"
                className="flex flex-col  text-2xl items-center p-4 bg-cover h-72 justify-center  bg-center rounded-lg text-white hover:bg-opacity-30 transition duration-300"
                style={{ backgroundImage: "url('/brand.jpg')" }}
              >
                <span>BRAND</span>
              </a>

              {/* Creator Block */}
              <a
                href="/creator/signup"
                className="flex flex-col text-2xl  items-center p-4 bg-cover h-72  justify-center bg-center rounded-lg text-white hover:bg-opacity-30 transition duration-300"
                style={{ backgroundImage: "url('/creator.jpg')" }}
              >
                <span>CREATOR</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
