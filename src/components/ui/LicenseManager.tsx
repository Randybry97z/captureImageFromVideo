import React, { useState, useEffect } from 'react';
import { LicenseService } from '../../services/licenseService';
import { LicenseInfo, UsageStats } from '../../types/license';

interface LicenseManagerProps {
  onLicenseChange?: (license: LicenseInfo) => void;
}

const LicenseManager: React.FC<LicenseManagerProps> = ({ onLicenseChange }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [currentLicense, setCurrentLicense] = useState<LicenseInfo | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [message, setMessage] = useState('');

  const licenseService = LicenseService.getInstance();

  useEffect(() => {
    updateLicenseInfo();
  }, []);

  const updateLicenseInfo = () => {
    const license = licenseService.getCurrentLicense();
    const stats = licenseService.getUsageStats();
    setCurrentLicense(license);
    setUsageStats(stats);
    onLicenseChange?.(license!);
  };

  const handleSetLicense = () => {
    if (!licenseKey.trim()) {
      setMessage('Please enter a license key');
      return;
    }

    const success = licenseService.setLicense(licenseKey.trim());
    if (success) {
      setMessage('License updated successfully!');
      setLicenseKey('');
      setShowLicenseInput(false);
      updateLicenseInfo();
    } else {
      setMessage('Invalid license key');
    }
  };

  const getRemainingImages = () => {
    return licenseService.getRemainingImages();
  };

  const remainingImages = getRemainingImages();
  const isUnlimited = remainingImages === -1;
  const isFreeUser = currentLicense?.type === 'free';

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">License & Usage</h3>
        <button
          onClick={() => setShowLicenseInput(!showLicenseInput)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showLicenseInput ? 'Cancel' : 'Enter License Key'}
        </button>
      </div>

      {/* License Input */}
      {showLicenseInput && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex gap-2">
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="Enter your license key"
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleSetLicense}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Set License
            </button>
          </div>
          {message && (
            <p className={`text-sm mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      )}

      {/* Current License Info */}
      {currentLicense && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Plan:</span>
            <span className={`text-sm font-semibold ${currentLicense.type === 'premium' ? 'text-purple-600' : 'text-gray-600'}`}>
              {currentLicense.type === 'premium' ? 'Premium' : 'Free'}
            </span>
          </div>
          
          {isFreeUser && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Images Remaining:</span>
              <span className={`text-sm font-semibold ${remainingImages < 10 ? 'text-red-600' : 'text-green-600'}`}>
                {remainingImages} / 100
              </span>
            </div>
          )}

          {usageStats && (
            <div className="text-xs text-gray-500">
              <div>Videos processed this month: {usageStats.videosProcessed}</div>
              <div>Images generated this month: {usageStats.imagesGenerated}</div>
              <div>Resets on: {new Date(currentLicense.resetDate).toLocaleDateString()}</div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Prompt for Free Users */}
      {isFreeUser && remainingImages < 20 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-800 font-medium">⚠️ Running low on images</span>
          </div>
          <p className="text-sm text-yellow-700 mb-2">
            You have {remainingImages} images remaining this month. Upgrade to Premium for unlimited usage!
          </p>
          <button
            onClick={() => setShowLicenseInput(true)}
            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {/* Premium Features Info */}
      {isFreeUser && (
        <div className="text-xs text-gray-500 mt-2">
          <p><strong>Free Plan:</strong> 100 images/month, 10 videos/month, max 5min videos</p>
          <p><strong>Premium Plan:</strong> Unlimited images & videos, no duration limits</p>
        </div>
      )}
    </div>
  );
};

export default LicenseManager; 