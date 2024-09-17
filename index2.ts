import axios from 'axios';

// Your actual Geoapify API key
const GEOAPIFY_API_KEY = 'ff9c233e5bd04c43877288681d51331f';

// Define the agents (vehicles or workers) with 4-day time windows (8 hours per day)
const agents = [
    {
        start_location: [13.381453755359324, 52.520666399999996], // Start location (longitude, latitude)
        time_windows: [
            [0, 28800],       // Day 1: Available for 8 hours (0 to 28,800 seconds)
            [86400, 115200],  // Day 2: Available for 8 hours
            [172800, 201600], // Day 3: Available for 8 hours
            [259200, 288000]  // Day 4: Available for 8 hours
        ],
        capabilities: ['plumbing', 'electrical'], // Skills of the agent
        id: 'agent1',
        description: 'Agent 1 - Plumbing and electrical work',
    },
    {
        start_location: [13.383333, 52.516667], // Start location (longitude, latitude)
        time_windows: [
            [0, 28800],       // Day 1: Available for 8 hours
            [86400, 115200],  // Day 2: Available for 8 hours
            [172800, 201600], // Day 3: Available for 8 hours
            [259200, 288000]  // Day 4: Available for 8 hours
        ],
        capabilities: ['carpentry'], // Skills of the agent
        id: 'agent2',
        description: 'Agent 2 - Carpentry work',
    },
    {
        start_location: [13.385, 52.510], // New agent start location
        time_windows: [
            [0, 28800],       // Day 1: Available for 8 hours
            [86400, 115200],  // Day 2: Available for 8 hours
            [172800, 201600], // Day 3: Available for 8 hours
            [259200, 288000]  // Day 4: Available for 8 hours
        ],
        capabilities: ['carpentry'], // Skills of the agent
        id: 'agent3',
        description: 'Agent 3 - Plumbing work',
    },
    {
        start_location: [13.387, 52.518], // New agent start location
        time_windows: [
            [0, 28800],       // Day 1: Available for 8 hours
            [86400, 115200],  // Day 2: Available for 8 hours
            [172800, 201600], // Day 3: Available for 8 hours
            [259200, 288000]  // Day 4: Available for 8 hours
        ],
        capabilities: ['electrical'], // Skills of the agent
        id: 'agent4',
        description: 'Agent 4 - Electrical work',
    }
];

// Define the jobs (tasks to be done)
const jobs = [
    {
        location: [13.3908216, 52.5194189], // Job location (longitude, latitude)
        duration: 3600, // Duration of the job in seconds (1 hour)
        requirements: ['plumbing'], // Required skill for the job
        id: 'job1',
        description: 'Plumbing work required at location 1',
    },
    {
        location: [13.391175446198714, 52.50929975], // Another job location
        duration: 5400, // Job duration (1.5 hours)
        requirements: ['carpentry'], // Required skill for the job
        id: 'job2',
        description: 'Carpentry work required at location 2',
    },
    {
        location: [13.400, 52.515], // New job location
        duration: 3600, // Duration of 1 hour
        requirements: ['electrical'], // Required skill for the job
        id: 'job3',
        description: 'Electrical work required at location 3',
    },
    {
        location: [13.395, 52.512], // New job location
        duration: 5400, // Duration of 1.5 hours
        requirements: ['plumbing'], // Required skill for the job
        id: 'job4',
        description: 'Plumbing work required at location 4',
    }
];

// Optional: Define any additional locations (warehouses, repeated stops)
const locations = [
    {
        id: 'warehouse',
        location: [13.3465209, 52.5245064], // Warehouse location
    }
];

// Function to call the Geoapify Route Planner API
async function planRoutes() {
    const requestBody = {
        mode: 'drive', // Travel mode (options: drive, walk, etc.)
        agents: agents,
        jobs: jobs,
        locations: locations,
    };

    try {
        const response = await axios.post(
            `https://api.geoapify.com/v1/routeplanner?apiKey=${GEOAPIFY_API_KEY}`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Process and display the response
        const routePlan = response.data;
        console.log('Optimized Route Plan:', JSON.stringify(routePlan, null, 2));

        // Summarize agent jobs and times
        const agentSummary = summarizeAgentJobs(routePlan);
        agentSummary.forEach((agent: any) => {
            console.log(`Agent: ${agent.agentId}`);
            console.log(`Total Time: ${agent.totalTime} seconds`);
            console.log(`Total Distance: ${agent.distance} meters`);
            agent.jobs.forEach((job: any) => {
                console.log(`  - Job ID: ${job.jobId}`);
                console.log(`    Start Time: ${job.startTime} seconds`);
                console.log(`    Duration: ${job.duration} seconds`);
            });
            console.log();
        });

    } catch (error: unknown) {
        // Handle error, casting it to AxiosError if it's an Axios-related error
        if (axios.isAxiosError(error)) {
            console.error('Error fetching optimized route:', error.response ? error.response.data : error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
}

// Function to extract agent jobs and times
function summarizeAgentJobs(routePlan: any) {
    const summary = routePlan.features.map((feature: any) => {
        const agentId = feature.properties.agent_id;
        const totalTime = feature.properties.time;
        const distance = feature.properties.distance;

        // Find the jobs and the time information from the actions
        const jobs = feature.properties.actions
            .filter((action: any) => action.type === "job")
            .map((jobAction: any) => ({
                jobId: jobAction.job_id,
                startTime: jobAction.start_time,
                duration: jobAction.duration
            }));

        return {
            agentId,
            jobs,
            totalTime,
            distance
        };
    });

    return summary;
}

// Call the function to plan the routes and summarize the results
planRoutes();
