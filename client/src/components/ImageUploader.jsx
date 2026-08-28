import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { UploadCloud, Camera, Image as ImageIcon, X, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export const ImageUploader = ({
  selectedImage,
  onImageSelected,
  onClearImage,
  onLaunchCamera,
  sampleImages = []
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 10MB limit.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected({
        file,
        previewUrl: e.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '22px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Camera size={20} color="#16A34A" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#17211B' }}>{t('upload.title')}</h3>
            <span style={{ fontSize: '0.78rem', color: '#647067' }}>
              {t('upload.formatNotice')}
            </span>
          </div>
        </div>

        {/* Live Camera Button */}
        <button
          type="button"
          onClick={onLaunchCamera}
          className="btn-secondary"
          style={{ padding: '7px 14px', fontSize: '0.82rem', minHeight: 38 }}
        >
          <Camera size={15} color="#16A34A" />
          {t('upload.cameraBtn')}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Upload Box / Image Preview */}
      {!selectedImage ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: dragOver ? '2px dashed #16A34A' : '2px dashed #D1D8D3',
            borderRadius: 16,
            background: dragOver ? '#F0FDF4' : '#F7F9F7',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto'
          }}>
            <UploadCloud size={30} color="#16A34A" />
          </div>
          <h4 style={{ fontSize: '1rem', color: '#17211B', marginBottom: 6 }}>
            {t('upload.dropzone')}
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#647067' }}>
            Take or select a clear photo of the leaf symptoms or pest damage
          </p>
        </div>
      ) : (
        /* Image Preview Box */
        <div style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #E5EAE6',
          background: '#F7F9F7'
        }}>
          <img
            src={selectedImage.previewUrl}
            alt="Uploaded Crop"
            style={{
              width: '100%',
              maxHeight: 340,
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }}
          />

          {/* Overlay info */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px',
            background: 'linear-gradient(to top, rgba(23, 33, 27, 0.85) 0%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4ADE80', fontSize: '0.85rem', fontWeight: 600 }}>
              <CheckCircle size={16} />
              <span>{selectedImage.name || 'Leaf Image Ready'}</span>
              {selectedImage.size && <span style={{ color: '#E5EAE6', fontSize: '0.75rem' }}>({selectedImage.size})</span>}
            </div>

            <button
              type="button"
              onClick={onClearImage}
              title="Remove image"
              style={{
                background: '#DC2626',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={14} /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          borderRadius: 8,
          color: '#DC2626',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SIH Sample Image Quick Selector */}
      {sampleImages.length > 0 && !selectedImage && (
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: '0.78rem', color: '#647067', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontWeight: 600 }}>
            <Sparkles size={13} color="#D97706" /> Or test with sample images:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sampleImages.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onImageSelected({
                  previewUrl: sample.url,
                  name: sample.label,
                  sampleImageUrl: sample.url,
                  isSample: true
                })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: '#F1F5F2',
                  border: '1px solid #E5EAE6',
                  color: '#17211B',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <ImageIcon size={13} color="#16A34A" />
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
