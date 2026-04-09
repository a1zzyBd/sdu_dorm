import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StudentInfo } from './StudentInfo';
import { BlockedAccountWarning } from './BlockedAccountWarning';
import { useAuth } from '../contexts/AuthContext';
import type { StudentInfoProps } from './StudentInfo';


const ContractView: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [thumbStyle, setThumbStyle] = useState({ top: 0, height: 0 });

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const scrollbarHeight = clientHeight;

            const thumbHeight = Math.max(
                (clientHeight / scrollHeight) * scrollbarHeight,
                20 // minimum thumb height
            );

            const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (scrollbarHeight - thumbHeight);
            
            setThumbStyle({ top: thumbTop, height: thumbHeight });
        }
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (isOpen && scrollContainer) {
            handleScroll(); // Initial calculation
            scrollContainer.addEventListener('scroll', handleScroll);

            const resizeObserver = new ResizeObserver(handleScroll);
            resizeObserver.observe(scrollContainer);

            return () => {
                scrollContainer.removeEventListener('scroll', handleScroll);
                resizeObserver.unobserve(scrollContainer);
            };
        }
    }, [isOpen, handleScroll]);


    return (
        <div className="px-15 overflow-hidden">
            <button 
                className="w-full flex justify-between items-center p-3 bg-purple-200 text-purple-800 font-semibold"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span>View contract</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>
            {isOpen && (
                <div className="bg-white relative h-[500px]">
                    <div ref={scrollContainerRef} className="h-full overflow-y-auto hide-scrollbar pr-6">
                        <div className="p-8">
                            <div className="text-center text-[#3a2f2f] space-y-2 mb-8">
                                <img src="/sduLogo.png" alt="SDU University Logo" className="h-16 mx-auto mb-4"/>
                                <h2 className="text-lg font-semibold">Кешенді қызметтер көрсету туралы</h2>
                                <h2 className="text-lg font-semibold">ШАРТЫ</h2>
                                <h2 className="text-lg font-semibold">№1073</h2>
                                <h2 className="text-lg font-semibold">ДОГОВОР</h2>
                                <h2 className="text-lg font-semibold">О предоставлении комплексных услуг</h2>
                            </div>
                            
                            <div className="flex justify-between items-center text-sm mb-6">
                                <span className="text-blue-600">Қаскелең қаласы</span>
                                <span className="text-gray-600">25.10.2025 ж.</span>
                            </div>

                            <div className="text-xs leading-relaxed grid grid-cols-2 gap-8 text-[#3a2f2f]">
                                <div>
                                    <p className="font-bold mb-2">1. ЖАЛПЫ ЕРЕЖЕЛЕР</p>
                                    <p>
                                        1.1 Осы Шарт (бұдан әрі-«Шарт»): бұдан әрі <b className="font-semibold">«Жалға беруші»</b> деп аталатын <b className="font-semibold">«Dorm-Service» ЖШС</b> бір жағынан, Жарғы негізінде әрекет ететін Бас директоры <b className="font-semibold">Оспанов М.Б.</b> және бұдан әрі <b className="font-semibold">«Тамақтандыруды Жеткізуші»</b> деп аталатын <b className="font-semibold">«Naubay» ЖШС</b>, екінші жағынан, жарғы негізінде әрекет ететін директор Коктал Еламан атынан; және
                                    </p>
                                </div>
                                <div>
                                    <p className="font-bold mb-2">1. ОБЩИЕ ПОЛОЖЕНИЯ</p>
                                    <p>
                                        1.1. Настоящий договор (далее - «Договор») заключен между: ТОО <b className="font-semibold">«Dorm-Service»</b>, именуемым в дальнейшем <b className="font-semibold">«Арендодатель»</b>, в лице Генерального директора <b className="font-semibold">Оспанова М.Б.</b>, действующего на основании Устава, с одной стороны;
                                        ТОО <b className="font-semibold">«Naubay»</b>, именуемым в дальнейшем <b className="font-semibold">«Поставщик питания»</b>, в лице директора Коктал Еламан, действующего на основании
                                    </p>
                                </div>
                            </div>
                            {/* Add more content to make it scrollable */}
                            <div className="text-xs leading-relaxed grid grid-cols-2 gap-8 text-[#3a2f2f] mt-4">
                                <div>
                                    <p className="font-bold mb-2">2. ШАРТТЫҢ МӘНІ</p>
                                    <p>
                                        2.1. Осы Шарттың талаптарына сәйкес, Жалға беруші Студентке уақытша тұру үшін орын ұсынады, ал Тамақтандыруды Жеткізуші Студентке тамақтандыру қызметтерін көрсетеді.
                                    </p>
                                </div>
                                 <div>
                                    <p className="font-bold mb-2">2. ПРЕДМЕТ ДОГОВОРА</p>
                                     <p>
                                        2.1. В соответствии с условиями настоящего Договора, Арендодатель предоставляет Студенту место для временного проживания, а Поставщик питания оказывает Студенту услуги по организации питания.
                                    </p>
                                </div>
                            </div>
                             <div className="text-xs leading-relaxed grid grid-cols-2 gap-8 text-[#3a2f2f] mt-4">
                                <div>
                                    <p className="font-bold mb-2">3. ТАРАПТАРДЫҢ ҚҰҚЫҚТАРЫ МЕН МІНДЕТТЕРІ</p>
                                    <p>
                                        3.1. Жалға беруші міндеттенеді: Студентке жатақханада тұру үшін санитарлық және техникалық нормаларға сәйкес келетін орын беруге.
                                    </p>
                                </div>
                                 <div>
                                    <p className="font-bold mb-2">3. ПРАВА И ОБЯЗАННОСТИ СТОРОН</p>
                                     <p>
                                        3.1. Арендодатель обязуется: Предоставить Студенту для проживания в общежитии место, соответствующее санитарным и техническим нормам.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Custom Scrollbar */}
                    <div className="absolute top-0 right-1 w-2 h-full py-1">
                        <div className="relative h-full w-full bg-gray-200 rounded-full">
                            <div 
                                className="absolute w-full bg-gray-500 rounded-full"
                                style={{
                                    height: `${thumbStyle.height}px`,
                                    top: `${thumbStyle.top}px`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export const RulesAndRegulationsPage: React.FC<StudentInfoProps> = ({ studentData }) => {
    const { user } = useAuth();
    const isCoordinator = user?.access === 'coordinator';

    // Block access for blocked students
    if (!isCoordinator && user?.account_status === 'blocked') {
        return <BlockedAccountWarning />;
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-base text-gray-500">Student account</span>
                    <h1 className="text-4xl font-bold text-[#C97C4B]" style={{ fontFamily: 'Playfair Display, serif' }}>Rules and Regulations</h1>
                </div>
                <StudentInfo studentData={studentData} />
            </div>
            
            <ContractView />
        </div>
    );
};
