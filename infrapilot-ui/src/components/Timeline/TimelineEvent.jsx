import { AlertCircle, CheckCircle, XCircle, Info, Clock } from 'lucide-react';

const getSeverityStyles = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('error') || lowerCaseMessage.includes('fatal')) {
        return {
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            borderColor: 'border-red-500',
            bgColor: 'bg-red-500/10'
        };
    }
    if (lowerCaseMessage.includes('warn') || lowerCaseMessage.includes('warning')) {
        return {
            icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-500/10'
        };
    }
    if (lowerCaseMessage.includes('info') || lowerCaseMessage.includes('ok')) {
        return {
            icon: <Info className="h-5 w-5 text-blue-500" />,
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-500/10'
        };
    }
    if (lowerCaseMessage.includes('success') || lowerCaseMessage.includes('resolved') || lowerCaseMessage.includes('restored')) {
        return {
            icon: <CheckCircle className="h-5 w-5 text-green-500" />,
            borderColor: 'border-green-500',
            bgColor: 'bg-green-500/10'
        };
    }
    return {
        icon: <Clock className="h-5 w-5 text-gray-500" />,
        borderColor: 'border-gray-500',
        bgColor: 'bg-gray-800'
    };
};

export default function TimelineEvent({ event, isLast }) {
    const { icon, borderColor, bgColor } = getSeverityStyles(event.message);
    const timestamp = new Date(event.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <div className="flex items-start">
            <div className="flex flex-col items-center mr-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
                    {icon}
                </div>
                {!isLast && <div className={`w-px h-full ${borderColor.replace('border-', 'bg-')}`}></div>}
            </div>
            <div className={`border ${borderColor} ${bgColor} rounded-lg p-3 w-full`}>
                <div className="flex justify-between items-center">
                    <p className="font-mono text-sm text-gray-400">{timestamp}</p>
                </div>
                <p className="text-gray-200 mt-1 font-mono text-sm">{event.message}</p>
            </div>
        </div>
    );
} 