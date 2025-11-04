import React from 'react';
import { CaptureSettings } from '../../types/video';

interface CaptureSettingsFormProps {
  settings: CaptureSettings;
  videoDuration: number;
  onChange: (field: keyof CaptureSettings, value: any) => void;
  onStart: () => void;
  disabled?: boolean;
}

const CaptureSettingsForm: React.FC<CaptureSettingsFormProps> = ({ settings, videoDuration, onChange, onStart, disabled }) => (
  <div className="bg-[#23262F] p-6 rounded-lg shadow-md mb-4">
    <h2 className="text-xl font-semibold mb-4 text-white">Configuración de Captura</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tiempo de inicio (segundos)
        </label>
        <input
          type="number"
          min={0}
          max={videoDuration}
          step={0.1}
          value={settings.startTime}
          onChange={e => onChange('startTime', Number(e.target.value))}
          className="w-full border rounded px-3 py-2 text-gray-100 bg-[#181A20] border-[#353945] focus:ring-2 focus:ring-[#00FFB0] focus:border-[#00FFB0]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tiempo de fin (segundos)
        </label>
        <input
          type="number"
          min={settings.startTime}
          max={videoDuration}
          step={0.1}
          value={settings.endTime || videoDuration}
          onChange={e => onChange('endTime', Number(e.target.value))}
          className="w-full border rounded px-3 py-2 text-gray-100 bg-[#181A20] border-[#353945] focus:ring-2 focus:ring-[#00FFB0] focus:border-[#00FFB0]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Intervalo
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={settings.interval}
            onChange={e => onChange('interval', Number(e.target.value))}
            className="flex-1 border rounded px-3 py-2 text-gray-100 bg-[#181A20] border-[#353945] focus:ring-2 focus:ring-[#00FFB0] focus:border-[#00FFB0]"
          />
          <select
            value={settings.intervalType}
            onChange={e => onChange('intervalType', e.target.value)}
            className="border rounded px-3 py-2 text-gray-100 bg-[#181A20] border-[#353945] focus:ring-2 focus:ring-[#00FFB0] focus:border-[#00FFB0]"
          >
            <option value="seconds">Segundos</option>
            <option value="minutes">Minutos</option>
          </select>
        </div>
      </div>
      <div className="flex items-end">
        <button
          onClick={onStart}
          disabled={disabled}
          className="w-full bg-[#00FFB0] text-black px-4 py-2 rounded font-semibold hover:bg-[#00e6a0] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {disabled ? 'Capturando...' : 'Iniciar Captura'}
        </button>
      </div>
    </div>
  </div>
);

export default CaptureSettingsForm; 