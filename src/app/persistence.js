import { initialState, storageKey } from "../data/initialState";
import { clone, mergeLoadedState, onlyDigits, slugify } from "../utils/helpers";

const legacyStorageKeys = [
  "terra-da-esperanca-react-v1",
  "terra-da-esperanca-v4",
  "terra-da-esperanca-v3"
];

export function restoreLegacyUserMedia(targetState) {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return targetState;

  let nextState = targetState;

  legacyStorageKeys.forEach((legacyKey) => {
    try {
      const raw = window.localStorage.getItem(legacyKey);
      if (!raw) return;
      const legacyState = JSON.parse(raw);
      const legacyUsers = [
        ...(Array.isArray(legacyState?.users) ? legacyState.users : []),
        ...(legacyState?.currentUser ? [legacyState.currentUser] : [])
      ];

      if (!legacyUsers.length) return;

      nextState = {
        ...nextState,
        users: nextState.users.map((user) => {
          const matchedLegacyUser = legacyUsers.find((legacyUser) => (
            (legacyUser.email && user.email && String(legacyUser.email).toLowerCase() === String(user.email).toLowerCase())
            || (legacyUser.cpf && user.cpf && onlyDigits(legacyUser.cpf) === onlyDigits(user.cpf))
            || (legacyUser.nome && user.nome && slugify(legacyUser.nome) === slugify(user.nome))
          ));

          if (!matchedLegacyUser?.foto || user.foto) return user;

          return {
            ...user,
            foto: matchedLegacyUser.foto
          };
        })
      };

      if (nextState.currentUser) {
        const refreshedCurrentUser = nextState.users.find((user) => user.id === nextState.currentUser.id);
        nextState.currentUser = refreshedCurrentUser || nextState.currentUser;
      }
    } catch {
      // Ignore stale legacy state and continue with the current structure.
    }
  });

  return nextState;
}

export function loadState() {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
    return restoreLegacyUserMedia(clone(initialState));
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return restoreLegacyUserMedia(clone(initialState));
  try {
    return restoreLegacyUserMedia(mergeLoadedState(JSON.parse(raw)));
  } catch {
    return restoreLegacyUserMedia(clone(initialState));
  }
}

export function buildResidentDocuments() {
  return [
    {
      tipo: "RG ou outro documento oficial",
      nome: "nao_enviado",
      status: "Pendente"
    },
    {
      tipo: "CPF",
      nome: "nao_enviado",
      status: "Pendente"
    },
    {
      tipo: "Comprovante de endereco",
      nome: "nao_enviado",
      status: "Pendente"
    },
    {
      tipo: "Documento comprobatorio de idade",
      nome: "nao_enviado",
      status: "Pendente"
    }
  ];
}
