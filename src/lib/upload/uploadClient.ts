import { apiBaseUrl } from "@/src/lib/config";

type UploadTarget = "avatar" | "massage";

type GenerateUploadUrlPayload = {
  target: UploadTarget;
  contentType: "image/jpeg" | "image/png";
  massageId?: string;
};

type GenerateUploadUrlResponse = {
  success: boolean;
  data: {
    url: string;
    key: string;
    expiresIn: number;
    target: UploadTarget;
    contentType: "image/jpeg" | "image/png";
  };
};

type FinalizeUploadPayload = {
  target: UploadTarget;
  key: string;
  massageId?: string;
};

type FinalizeAvatarResponse = {
  success: boolean;
  data: {
    avatarKey: string;
    avatarUrl: string;
  };
};

type FinalizeMassageResponse = {
  success: boolean;
  data: {
    id: string;
    pictures: string[];
  };
};

function getImageContentType(file: File): "image/jpeg" | "image/png" {
  if (file.type === "image/png") {
    return "image/png";
  }

  if (file.type === "image/jpeg") {
    return "image/jpeg";
  }

  throw new Error("Only JPEG and PNG images are supported.");
}

async function parseJsonSafe<T>(response: Response): Promise<T | null> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function getApiErrorMessage(
  response: Response,
  json: { message?: string; error?: string } | null,
) {
  return (
    json?.message ??
    json?.error ??
    `${response.status} ${response.statusText}`
  );
}

async function postWithAuth<TResponse, TPayload>(
  endpoint: string,
  token: string,
  payload: TPayload,
) {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json = await parseJsonSafe<TResponse & { message?: string; error?: string }>(
    response,
  );

  if (!response.ok) {
    throw new Error(getApiErrorMessage(response, json));
  }

  if (!json) {
    throw new Error("Unexpected empty server response.");
  }

  return json as TResponse;
}

export async function uploadAvatarImage(params: {
  token: string;
  file: File;
}) {
  const contentType = getImageContentType(params.file);

  const presigned = await postWithAuth<GenerateUploadUrlResponse, GenerateUploadUrlPayload>(
    "/api/uploads/presigned-url",
    params.token,
    {
      target: "avatar",
      contentType,
    },
  );

  const putResponse = await fetch(presigned.data.url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: params.file,
  });

  if (!putResponse.ok) {
    throw new Error("Unable to upload file to storage.");
  }

  return postWithAuth<FinalizeAvatarResponse, FinalizeUploadPayload>(
    "/api/uploads/finalize",
    params.token,
    {
      target: "avatar",
      key: presigned.data.key,
    },
  );
}

export async function uploadMassageImage(params: {
  token: string;
  massageId: string;
  file: File;
}) {
  const contentType = getImageContentType(params.file);

  const presigned = await postWithAuth<GenerateUploadUrlResponse, GenerateUploadUrlPayload>(
    "/api/uploads/presigned-url",
    params.token,
    {
      target: "massage",
      contentType,
      massageId: params.massageId,
    },
  );

  const putResponse = await fetch(presigned.data.url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: params.file,
  });

  if (!putResponse.ok) {
    throw new Error("Unable to upload file to storage.");
  }

  return postWithAuth<FinalizeMassageResponse, FinalizeUploadPayload>(
    "/api/uploads/finalize",
    params.token,
    {
      target: "massage",
      key: presigned.data.key,
      massageId: params.massageId,
    },
  );
}