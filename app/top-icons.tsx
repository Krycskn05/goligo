/**
 * The learner's own top-menu icons (made in ChatGPT, "goliqo-ust-menu-simgeleri"): public/icons/top, 128 × 128 WebP
 * with a clear background, cropped to the picture. Used in the header (site language, sounds, Hesabım), next to the
 * day in the header clock, in "Sesler ve animasyonlar", in the clock window, in the welcome tour and on Hesabım.
 */
export const TOP_ICONS={
 sounds:'sesler',soundsOff:'ses-kapali',animations:'animasyonlar',voice:'konusan-ses',
 language:'site-dili',account:'hesabim',clock:'saat',calendar:'takvim',
} as const;
export type TopIconName=keyof typeof TOP_ICONS;
export const topIconSrc=(name:TopIconName)=>'/icons/top/'+TOP_ICONS[name]+'.webp';

/** One icon as a decorative picture (the button or heading next to it carries the words). */
export function TopIcon({name,size=24,className=''}:{name:TopIconName;size?:number;className?:string}){
 return <img className={('top-icon top-icon-'+name+' '+className).trim()} src={topIconSrc(name)} alt="" aria-hidden="true" width={size} height={size} decoding="async" draggable={false}/>;
}
