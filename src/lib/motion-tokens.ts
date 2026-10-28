export const motionTokens = {
  duration: { fast: 0.18, normal: 0.42, slow: 0.64 },
  easing: { smooth: [0.22, 1, 0.36, 1] as const },
  distance: { small: 12, normal: 24 },
  scale: { rest: 1, photo: 1.06, settle: 1.02, inline: 0.985 },
  stagger: 0.08,
};

export const springs = {
  gentle: { stiffness: 120, damping: 30, restDelta: 0.001 },
};
