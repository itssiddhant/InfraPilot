import TimelineEvent from './TimelineEvent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const parseLogs = (rawLogs) => {
    if (!rawLogs) return [];
    
    // Regex to capture various timestamp formats, service, and message
    const logRegex = /(?:(\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\s+)?(?:\[([\w-]+)\]\s)?(.*)/;

    return rawLogs.split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
            const match = line.match(logRegex);
            if (!match) {
                // Return a default structure if no regex match
                return { timestamp: new Date().toISOString(), message: line };
            }
            // match[1] is timestamp, match[2] is service, match[3] is message
            const timestamp = match[1] ? new Date(match[1].replace(' ', 'T')).toISOString() : new Date().toISOString();
            const message = match[2] ? `[${match[2]}] ${match[3]}` : match[3];
            return { timestamp, message };
        })
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};


export default function IncidentTimeline({ rawLogs }) {
    const events = parseLogs(rawLogs);

    if (events.length === 0) {
        return (
            <div className="text-center text-gray-500 p-8">
                No timeline events could be parsed from the logs.
            </div>
        );
    }

    return (
        <Card className="bg-gray-950 border-gray-800">
            <CardHeader>
                <CardTitle className="text-blue-400">Incident Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.map((event, index) => (
                        <TimelineEvent 
                            key={index} 
                            event={event} 
                            isLast={index === events.length - 1} 
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 