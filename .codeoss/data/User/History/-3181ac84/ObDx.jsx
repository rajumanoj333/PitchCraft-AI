// src/components/SlidePreview.jsx
import React from 'react';
import { MagicEditor } from 'magic-ui';

const SlidePreview = ({ slide, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
      <div className="border rounded-lg p-4 min-h-[400px]">
        <MagicEditor
          initialContent={slide.content}
          onChange={onChange}
          toolbar={['bold', 'italic', 'heading', 'list', 'link']}
        />
      </div>
    </div>
  );
};

export default SlidePreview;