export enum Season {
  Winter = 'Зима',
  Spring = 'Весна',
  Summer = 'Лето',
  Autumn = 'Осень',
}

export enum TimeOfDay {
  Dawn = 'Рассвет',
  Noon = 'Полдень',
  Dusk = 'Закат',
  Midnight = 'Полночь',
}

export enum CloudType {
  Clear = 'Безоблачно',
  Cumulus = 'Кучевые облака',
  Stratus = 'Слоистые облака',
  Storm = 'Грозовые тучи',
  Overcast = 'Пасмурно',
}

export enum FieldOfView {
  UltraWide = 'Сверхширокий (14mm)',
  Wide = 'Широкий (24mm)',
  Standard = 'Портретный (50mm)',
  Telephoto = 'Телеобъектив (85mm+)',
}

export enum Visibility {
  CrystalClear = 'Кристально чисто',
  Haze = 'Легкая дымка',
  Mist = 'Туман',
  HeavyFog = 'Густой туман',
}

export enum AspectRatio {
  Square = '1:1',
  Landscape = '16:9',
  Portrait = '9:16',
  StandardLandscape = '4:3',
  StandardPortrait = '3:4',
}

export interface ReferenceImage {
  id: string;
  data: string;
  mimeType: string;
}

export interface GenParams {
  prompt: string;
  season: Season;
  timeOfDay: TimeOfDay;
  clouds: CloudType;
  fov: FieldOfView;
  visibility: Visibility;
  aspectRatio: AspectRatio;
  referenceImages: ReferenceImage[];
  imageCount: number;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
  params: GenParams;
}