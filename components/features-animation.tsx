"use client"

import type React from "react"
import { forwardRef, useRef } from "react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "@/components/ui/animated-beam"

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
    ({ className, children }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
                    className,
                )}
            >
                {children}
            </div>
        )
    },
)

Circle.displayName = "Circle"

export default function FeaturesAnimation() {
    const containerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)
    const div4Ref = useRef<HTMLDivElement>(null)
    const div5Ref = useRef<HTMLDivElement>(null)
    const div6Ref = useRef<HTMLDivElement>(null)
    const div7Ref = useRef<HTMLDivElement>(null)

    return (
        <div
            className="relative flex h-[500px] w-full items-center justify-center rounded-lg p-10"
            ref={containerRef}
        >
            <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div1Ref}>
                        <Icons.webpage />
                    </Circle>
                    <Circle ref={div5Ref}>
                        <Icons.youtube />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div2Ref}>
                        <Icons.pdf />
                    </Circle>
                    <Circle ref={div4Ref} className="size-16">
                        <Icons.sumwise />
                    </Circle>
                    <Circle ref={div6Ref}>
                        <Icons.medium />
                    </Circle>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <Circle ref={div3Ref}>
                        <Icons.docs />
                    </Circle>
                    <Circle ref={div7Ref}>
                        <Icons.blog />
                    </Circle>
                </div>
            </div>

            <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={-75} endYOffset={-10} />
            <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} />
            <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div5Ref}
                toRef={div4Ref}
                curvature={-75}
                endYOffset={-10}
                reverse
            />
            <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} reverse />
            <AnimatedBeam
                containerRef={containerRef}
                fromRef={div7Ref}
                toRef={div4Ref}
                curvature={75}
                endYOffset={10}
                reverse
            />
        </div>
    )
}

const Icons = {
    pdf: () => (
        <svg width="800px" height="800px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#A855F7">
            <g id="SVGRepo_bgCarrier" stroke-width="0" />
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
            <g id="SVGRepo_iconCarrier">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="add" fill="#A855F7" transform="translate(85.333333, 42.666667)">
                        <path d="M75.9466667,285.653333 C63.8764997,278.292415 49.6246897,275.351565 35.6266667,277.333333 L1.42108547e-14,277.333333 L1.42108547e-14,405.333333 L28.3733333,405.333333 L28.3733333,356.48 L40.5333333,356.48 C53.1304778,357.774244 65.7885986,354.68506 76.3733333,347.733333 C85.3576891,340.027178 90.3112817,328.626053 89.8133333,316.8 C90.4784904,304.790173 85.3164923,293.195531 75.9466667,285.653333 L75.9466667,285.653333 Z M53.12,332.373333 C47.7608867,334.732281 41.8687051,335.616108 36.0533333,334.933333 L27.7333333,334.933333 L27.7333333,298.666667 L36.0533333,298.666667 C42.094796,298.02451 48.1897668,299.213772 53.5466667,302.08 C58.5355805,305.554646 61.3626692,311.370371 61.0133333,317.44 C61.6596233,323.558965 58.5400493,329.460862 53.12,332.373333 L53.12,332.373333 Z M150.826667,277.333333 L115.413333,277.333333 L115.413333,405.333333 L149.333333,405.333333 C166.620091,407.02483 184.027709,403.691457 199.466667,395.733333 C216.454713,383.072462 225.530463,362.408923 223.36,341.333333 C224.631644,323.277677 218.198313,305.527884 205.653333,292.48 C190.157107,280.265923 170.395302,274.806436 150.826667,277.333333 L150.826667,277.333333 Z M178.986667,376.32 C170.098963,381.315719 159.922142,383.54422 149.76,382.72 L144.213333,382.72 L144.213333,299.946667 L149.333333,299.946667 C167.253333,299.946667 174.293333,301.653333 181.333333,308.053333 C189.877212,316.948755 194.28973,329.025119 193.493333,341.333333 C194.590843,354.653818 189.18793,367.684372 178.986667,376.32 L178.986667,376.32 Z M254.506667,405.333333 L283.306667,405.333333 L283.306667,351.786667 L341.333333,351.786667 L341.333333,329.173333 L283.306667,329.173333 L283.306667,299.946667 L341.333333,299.946667 L341.333333,277.333333 L254.506667,277.333333 L254.506667,405.333333 L254.506667,405.333333 Z M234.666667,7.10542736e-15 L9.52127266e-13,7.10542736e-15 L9.52127266e-13,234.666667 L42.6666667,234.666667 L42.6666667,192 L42.6666667,169.6 L42.6666667,42.6666667 L216.96,42.6666667 L298.666667,124.373333 L298.666667,169.6 L298.666667,192 L298.666667,234.666667 L341.333333,234.666667 L341.333333,106.666667 L234.666667,7.10542736e-15 L234.666667,7.10542736e-15 Z" id="document-pdf">
                        </path>
                    </g>
                </g>
            </g>
        </svg>
    ),
    sumwise: () => (
        <svg width="50" height="58" viewBox="0 0 50 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.720726 44.0123C8.58773 48.5544 16.4577 53.0966 24.2884 57.6387C24.7547 57.89 25.2907 57.89 25.7176 57.6387C33.5513 53.1329 41.3487 48.5908 49.1793 44.0849C49.679 43.8699 50 43.3703 50 42.798V15.5451C50 15.0455 49.7487 14.5791 49.3217 14.3308C41.4547 9.78869 33.6573 5.28288 25.7873 0.740734C25.324 0.419755 24.679 0.419755 24.2127 0.740734C16.4153 5.24654 8.61796 9.75236 0.823634 14.2612C0.32097 14.4762 0 14.9758 0 15.5481V42.801C0 43.2674 0.251365 43.767 0.714664 44.0183L0.720726 44.0123ZM23.6101 53.9535L14.6318 48.8027V38.4315L23.6101 43.6156V53.9505V53.9535ZM35.3743 48.8027L26.4323 53.9535V43.6186L35.3743 38.4345V48.8057V48.8027ZM38.2358 11.1786L47.1748 16.3627V26.7339L38.2358 21.5468V11.1756V11.1786ZM26.4323 4.38354L35.3743 9.53433V19.9056L26.4323 14.7184V4.38051V4.38354ZM25.003 17.1894C32.4067 21.4469 39.8074 25.7014 47.1748 29.9922V41.9743L38.2358 47.1585V35.9636C38.2358 35.4276 37.8785 34.9249 37.4122 34.713L16.0247 22.3371L25.003 17.1863V17.1894ZM14.6318 9.53433L23.6101 4.38354V14.7215L14.6318 19.9086V9.53737V9.53433ZM2.82827 16.3657L11.8035 11.1816V22.3402C11.8035 22.9125 12.1276 23.4121 12.5909 23.6271L33.9783 35.9666L25.003 41.1537C17.5993 36.8962 10.232 32.6417 2.82827 28.3479V16.3657ZM2.82827 31.6031L11.8035 36.7902V47.1615L2.82827 41.9774V31.6061V31.6031Z" fill="url(#gradient)" />
            <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="50" y2="58">
                    <stop offset="0%" stop-color="#A855F7" />
                    <stop offset="50%" stop-color="#EC4899" />
                    <stop offset="100%" stop-color="#3B82F6" />
                </linearGradient>
            </defs>
        </svg>
    ),
    webpage: () => (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            width="800px" height="800px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" xmlSpace="preserve">
            <g>
                <rect x="1" y="15" fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" width="54" height="42" />
                <polyline fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" points="11,12 11,7 63,7 63,50 58,50 	" />
                <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="1" y1="23" x2="55" y2="23" />
                <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="10" y1="19" x2="6" y2="19" />
                <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="18" y1="19" x2="14" y2="19" />
                <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="26" y1="19" x2="22" y2="19" />
            </g>
        </svg>
    ),
    docs: () => (
        <svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512" xmlSpace="preserve">
            <path style={{ fill: '#167EE6' }} d="M439.652,512H72.348c-9.217,0-16.696-7.479-16.696-16.696V16.696C55.652,7.479,63.131,0,72.348,0
	h233.739c4.424,0,8.674,1.761,11.804,4.892l133.565,133.565c3.131,3.13,4.892,7.379,4.892,11.804v345.043
	C456.348,504.521,448.869,512,439.652,512z"/>
            <path style={{ fill: '#2860CC' }} d="M317.891,4.892C314.761,1.761,310.511,0,306.087,0H256v512h183.652
	c9.217,0,16.696-7.479,16.696-16.696V150.261c0-4.424-1.761-8.674-4.892-11.804L317.891,4.892z"/>
            <path style={{ fill: '#167EE6' }} d="M451.459,138.459L317.891,4.892C314.76,1.76,310.511,0,306.082,0h-16.691l0.001,150.261
	c0,9.22,7.475,16.696,16.696,16.696h150.26v-16.696C456.348,145.834,454.589,141.589,451.459,138.
	C289.391,385.913,281.913,378.435,272.696,378.435z"/>
            <path style={{ fill: '#FFFFFF' }} d="M372.87,345.043H139.13c-9.217,0-16.696-7.479-16.696-16.696c0-9.217,7.479-16.696,16.696-16.696
	H372.87c9.217,0,16.696,7.479,16.696,16.696C389.565,337.565,382.087,345.043,372.87,345.043z"/>
            <path style={{ fill: '#E6F3FF' }} d="M372.87,311.652H256v33.391h116.87c9.217,0,16.696-7.479,16.696-16.696
	C389.565,319.131,382.087,311.652,372.87,311.652z"/>
            <path style={{ fill: '#FFFFFF' }} d="M372.87,278.261H139.13c-9.217,0-16.696-7.479-16.696-16.696c0-9.217,7.479-16.696,16.696-16.696
	H372.87c9.217,0,16.696,7.479,16.696,16.696C389.565,270.782,382.087,278.261,372.87,278.261z"/>
            <path style={{ fill: '#E6F3FF' }} d="M372.87,244.87H256v33.391h116.87c9.217,0,16.696-7.479,16.696-16.696
	C389.565,252.348,382.087,244.87,372.87,244.87z"/>
        </svg>
    ),
    youtube: () => (
        <svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 461.001 461.001" xmlSpace="preserve">
            <g>
                <path style={{ fill: '#F61C0D' }} d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728
		c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137
		C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607
		c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/>
            </g>
        </svg>
    ),
    medium: () => (
        <svg fill="#000000" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m24 24h-24v-24h24zm-8.986-15.006v7.326c0 .198 0 .234-.127.362l-1.302 1.264v.27h6.32v-.27l-1.257-1.234c-.091-.07-.148-.178-.148-.3 0-.022.002-.043.005-.064v.002-9.07c-.003-.019-.005-.04-.005-.062 0-.121.058-.229.148-.298l.001-.001 1.286-1.234v-.27h-4.456l-3.176 7.924-3.609-7.924h-4.675v.271l1.502 1.813c.127.115.207.281.207.466 0 .022-.001.043-.003.064v-.003 7.126c.007.041.011.088.011.136 0 .222-.088.423-.231.571l-1.69 2.054v.27h4.8v-.27l-1.691-2.054c-.149-.154-.241-.363-.241-.595 0-.04.003-.079.008-.117v.004-6.16l4.215 9.195h.49z" />
        </svg>
    ),
    blog: () => (
        <svg fill="#A855F7" width="800px" height="800px" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path d="M12,72A12,12,0,1,0,24,84,12.0119,12.0119,0,0,0,12,72Z" />
                <path d="M12,36a6,6,0,0,0,0,12A36.0393,36.0393,0,0,1,48,84a6,6,0,0,0,12,0A48.0512,48.0512,0,0,0,12,36Z" />
                <path d="M12,0a6,6,0,0,0,0,12A72.0788,72.0788,0,0,1,84,84a6,6,0,0,0,12,0A84.0981,84.0981,0,0,0,12,0Z" />
            </g>
        </svg>
    ),
}
