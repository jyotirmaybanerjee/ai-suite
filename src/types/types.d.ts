export type Place = {
  id: number;
  day: number;
  startTime: string;
  endTime: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  phone: string | null;
  description: string;
};

export type TravelPlanProps = {
  places: Place[];
  prompt: string;
  loading: boolean;
  setSelectedPlace: (place: Place | null) => void;
  setHoveredPlaceId: (id: number | null) => void;
};

export type MapViewProps = {
  places: Place[];
  hoveredPlaceId: number | null;
  setSelectedPlace: (place: Place) => void;
};

export type Recipe = {
  id: string;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string;
  firebaseId?: string;
};

export type ChatMessageData = {
  sender: 'user' | 'ai';
  text: string;
  recipes?: Recipe[];
};
