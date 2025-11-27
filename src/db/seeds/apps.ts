import { db } from '@/db';
import { apps } from '@/db/schema';

async function main() {
    const sampleApps = [
        {
            name: 'Arc Browser',
            slug: 'arc-browser',
            description: 'A revolutionary browser built for the way you work. Arc combines browsing, organizing, and collaborating in one beautiful interface with spaces, split view, and powerful keyboard shortcuts.',
            shortDescription: 'The browser that browses for you',
            developer: 'The Browser Company',
            iconUrl: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=128&h=128',
            downloadUrl: 'https://arc.net',
            platform: 'macOS',
            category: 'Browser',
            screenshots: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800',
                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800'
            ],
            rating: 4.8,
            reviewsCount: 3420,
            createdAt: new Date('2023-03-15').toISOString(),
        },
        {
            name: 'Raycast',
            slug: 'raycast',
            description: 'Supercharge your productivity with this blazingly fast launcher. Search apps, files, and snippets instantly. Control your tools with extensions and custom scripts.',
            shortDescription: 'Extendable launcher for power users',
            developer: 'Raycast',
            iconUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=128&h=128',
            downloadUrl: 'https://raycast.com',
            platform: 'macOS',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800',
                'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=800',
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800'
            ],
            rating: 4.9,
            reviewsCount: 4780,
            createdAt: new Date('2022-11-08').toISOString(),
        },
        {
            name: 'Notion',
            slug: 'notion',
            description: 'Your all-in-one workspace for notes, tasks, wikis, and databases. Collaborate with your team in real-time. Connect everything with powerful databases and views.',
            shortDescription: 'Write, plan, and get organized',
            developer: 'Notion Labs',
            iconUrl: 'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?w=128&h=128',
            downloadUrl: 'https://notion.so',
            platform: 'Both',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&h=800',
                'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&h=800',
                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800',
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800'
            ],
            rating: 4.7,
            reviewsCount: 4520,
            createdAt: new Date('2023-01-20').toISOString(),
        },
        {
            name: 'Obsidian',
            slug: 'obsidian',
            description: 'A powerful knowledge base that works on local Markdown files. Build a second brain with bidirectional links, graph view, and hundreds of plugins.',
            shortDescription: 'A second brain, for you, forever',
            developer: 'Obsidian',
            iconUrl: 'https://images.unsplash.com/photo-1609587312208-cea54be969e7?w=128&h=128',
            downloadUrl: 'https://obsidian.md',
            platform: 'Both',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=800',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800',
                'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&h=800'
            ],
            rating: 4.8,
            reviewsCount: 3890,
            createdAt: new Date('2023-05-12').toISOString(),
        },
        {
            name: 'Figma',
            slug: 'figma',
            description: 'The collaborative interface design tool. Create stunning designs, prototypes, and design systems. Real-time collaboration makes it easy to work with your team.',
            shortDescription: 'Where teams design together',
            developer: 'Figma',
            iconUrl: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=128&h=128',
            downloadUrl: 'https://figma.com',
            platform: 'macOS',
            category: 'Design',
            screenshots: [
                'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=800',
                'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&h=800',
                'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?w=1200&h=800',
                'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=1200&h=800'
            ],
            rating: 4.9,
            reviewsCount: 4920,
            createdAt: new Date('2022-09-18').toISOString(),
        },
        {
            name: 'Visual Studio Code',
            slug: 'visual-studio-code',
            description: 'Free, open-source code editor with built-in Git, debugging, and extensions for every programming language. Lightweight yet powerful with IntelliSense and thousands of extensions.',
            shortDescription: 'Code editing. Redefined.',
            developer: 'Microsoft',
            iconUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=128&h=128',
            downloadUrl: 'https://code.visualstudio.com',
            platform: 'macOS',
            category: 'Development',
            screenshots: [
                'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=800',
                'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800',
                'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=1200&h=800',
                'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=1200&h=800'
            ],
            rating: 4.8,
            reviewsCount: 4650,
            createdAt: new Date('2023-02-25').toISOString(),
        },
        {
            name: 'IINA',
            slug: 'iina',
            description: 'The modern media player for macOS. Built with native design and support for virtually every video format. Features picture-in-picture, touch bar support, and online streaming.',
            shortDescription: 'The modern video player for macOS',
            developer: 'IINA Team',
            iconUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=128&h=128',
            downloadUrl: 'https://iina.io',
            platform: 'macOS',
            category: 'Media',
            screenshots: [
                'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&h=800',
                'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800',
                'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&h=800'
            ],
            rating: 4.7,
            reviewsCount: 2340,
            createdAt: new Date('2023-04-10').toISOString(),
        },
        {
            name: 'Rectangle',
            slug: 'rectangle',
            description: 'Move and resize windows with keyboard shortcuts or snap areas. Boost your productivity with window management that just works. Open source and lightweight.',
            shortDescription: 'Window management made simple',
            developer: 'Ryan Hanson',
            iconUrl: 'https://images.unsplash.com/photo-1508830524289-0adcbe822b40?w=128&h=128',
            downloadUrl: 'https://rectangleapp.com',
            platform: 'macOS',
            category: 'Utilities',
            screenshots: [
                'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=1200&h=800',
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=800',
                'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800'
            ],
            rating: 4.6,
            reviewsCount: 1890,
            createdAt: new Date('2023-06-22').toISOString(),
        },
        {
            name: 'Linear',
            slug: 'linear',
            description: 'The issue tracker built for modern software teams. Track bugs, plan sprints, and build products with a tool designed for speed and focus.',
            shortDescription: 'Issue tracking for high-performance teams',
            developer: 'Linear',
            iconUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=128&h=128',
            downloadUrl: 'https://linear.app',
            platform: 'Both',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800',
                'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800',
                'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=800',
                'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=800'
            ],
            rating: 4.9,
            reviewsCount: 3120,
            createdAt: new Date('2023-07-14').toISOString(),
        },
        {
            name: 'Warp',
            slug: 'warp',
            description: 'The terminal reimagined with AI, modern editing, and team collaboration. Command autocomplete, AI command search, and shared workflows make you faster.',
            shortDescription: 'The terminal for the 21st century',
            developer: 'Warp',
            iconUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=128&h=128',
            downloadUrl: 'https://warp.dev',
            platform: 'macOS',
            category: 'Development',
            screenshots: [
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=800',
                'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=800',
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=800'
            ],
            rating: 4.7,
            reviewsCount: 2680,
            createdAt: new Date('2023-08-05').toISOString(),
        },
        {
            name: 'Bear',
            slug: 'bear',
            description: 'Beautiful writing app for notes and prose. Focus on your writing with a clean, distraction-free editor. Organize with tags and export to multiple formats.',
            shortDescription: 'Write beautifully on iPhone, iPad, and Mac',
            developer: 'Shiny Frog',
            iconUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=128&h=128',
            downloadUrl: 'https://bear.app',
            platform: 'Both',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800',
                'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200&h=800',
                'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=800',
                'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800'
            ],
            rating: 4.8,
            reviewsCount: 3560,
            createdAt: new Date('2022-12-18').toISOString(),
        },
        {
            name: 'Things 3',
            slug: 'things-3',
            description: 'Award-winning personal task manager that helps you achieve your goals. Beautiful design, powerful features, and seamless sync across all your devices.',
            shortDescription: 'To-dos, done beautifully',
            developer: 'Cultured Code',
            iconUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=128&h=128',
            downloadUrl: 'https://culturedcode.com/things',
            platform: 'Both',
            category: 'Productivity',
            screenshots: [
                'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=1200&h=800',
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800',
                'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1200&h=800',
                'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=800'
            ],
            rating: 4.9,
            reviewsCount: 4210,
            createdAt: new Date('2023-03-28').toISOString(),
        }
    ];

    await db.insert(apps).values(sampleApps);
    
    console.log('✅ Apps seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});