import { useState } from 'react';
import ProtectTab from './components/ProtectTab';
import VerifyTab from './components/VerifyTab';

type TabType = 'protect' | 'verify';

function App() {
    const [activeTab, setActiveTab] = useState<TabType>('protect');
    const [language, setLanguage] = useState<'ko' | 'en'>('ko');

    const t = {
        ko: {
            title: 'AuthPixel 🔒',
            subtitle: '보이지 않는 워터마크를 삽입해서 이미지 자산을 지켜보세요',
            tabProtect: '🛡️ 보호하기',
            tabVerify: '🔍 검증하기',
            footer: '© 2025 AuthPixel | 자산 보호',
            langButton: 'English',
        },
        en: {
            title: 'AuthPixel 🔒',
            subtitle: 'Protect your image assets by inserting an invisible watermark.',
            tabProtect: '🛡️ PROTECT',
            tabVerify: '🔍 VERIFY',
            footer: '© 2025 AuthPixel | Secure Your Assets',
            langButton: '한국어',
        },
    }[language];

    const toggleLanguage = () => {
        setLanguage(language === 'ko' ? 'en' : 'ko');
    };

    return (
        <div className="container">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>{t.title}</h1>
                <button className="btn" onClick={toggleLanguage}>
                    {t.langButton}
                </button>
            </div>

            {/* Subtitle with Logo */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                <img src="/shield_icon.jpg" alt="AuthPixel Logo" style={{ width: '100px', borderRadius: '8px' }} />
                <h3 style={{ margin: 0, color: '#E0E0E0' }}>{t.subtitle}</h3>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'protect' ? 'active' : ''}`}
                    onClick={() => setActiveTab('protect')}
                >
                    {t.tabProtect}
                </button>
                <button
                    className={`tab ${activeTab === 'verify' ? 'active' : ''}`}
                    onClick={() => setActiveTab('verify')}
                >
                    {t.tabVerify}
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'protect' ? (
                <ProtectTab language={language} />
            ) : (
                <VerifyTab language={language} />
            )}

            {/* Footer */}
            <div className="footer">{t.footer}</div>
        </div>
    );
}

export default App;
