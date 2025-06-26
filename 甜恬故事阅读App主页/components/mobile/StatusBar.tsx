import { Wifi, Battery, Signal } from 'lucide-react';

export function StatusBar() {
  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="time">{getCurrentTime()}</span>
      </div>
      
      <div className="status-center">
        {/* Dynamic Island 区域 */}
        <div className="dynamic-island"></div>
      </div>
      
      <div className="status-right">
        <div className="status-icons">
          <Signal className="status-icon" />
          <Wifi className="status-icon" />
          <div className="battery-container">
            <Battery className="status-icon" />
            <span className="battery-percentage">85%</span>
          </div>
        </div>
      </div>
    </div>
  );
}