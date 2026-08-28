import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

export const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access was denied or unavailable on this device. Please use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-crop-${Date.now()}.jpg`, { type: 'image/jpeg' });
        const previewUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture({
          file,
          previewUrl,
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB'
        });
        stopCamera();
        onClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(23, 33, 27, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-card" style={{
        maxWidth: 600,
        width: '100%',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#17211B', fontWeight: 700 }}>
            <Camera size={20} color="#16A34A" />
            <span>{t('upload.title')}</span>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{
              padding: 6,
              borderRadius: '50%',
              background: '#F1F5F2',
              color: '#17211B',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div style={{
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#000000',
          aspectRatio: '4/3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {cameraError ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#DC2626' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 10px auto' }} />
              <p style={{ fontSize: '0.9rem' }}>{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Viewfinder Target Overlay */}
              <div style={{
                position: 'absolute',
                inset: 30,
                border: '2px dashed rgba(74, 222, 128, 0.8)',
                borderRadius: 12,
                pointerEvents: 'none'
              }} />

              {/* Live Scan Line */}
              <div className="scan-line" />
            </>
          )}
        </div>

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Controls */}
        {!cameraError && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginTop: 20
          }}>
            {/* Flip Camera Button */}
            <button
              type="button"
              onClick={toggleCamera}
              title="Switch Camera"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#F1F5F2',
                color: '#17211B',
                border: '1px solid #E5EAE6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={20} />
            </button>

            {/* Shutter Button */}
            <button
              type="button"
              onClick={capturePhoto}
              title="Capture Photo"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#16A34A',
                border: '4px solid #DCFCE7',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Camera size={28} />
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => { stopCamera(); onClose(); }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
