import * as fs from "fs";
import * as path from "path";
import { EOL } from "os";

const podVersionRegex = /^COCOAPODS: ([\d.]+(beta|rc)?\.?\d*)$/i;

export const getVersionFromPodfileLine = (line: string): string | null => {
    const match = line.match(podVersionRegex);
    if (match && match.length >= 2) {
        return match[1].trim();
    }

    return null;
};

export const getVersionFromPodfile = (podfilePath: string): string => {
    const absolutePath = path.resolve(podfilePath);

    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Podfile is not found on path '${absolutePath}'`);
    }

    const fileContent = fs.readFileSync(absolutePath);
    const podLines = fileContent.toString().split(EOL);
    
    for (const podLine of podLines) {
        const matchedVersion = getVersionFromPodfileLine(podLine);
        if (matchedVersion) {
            return matchedVersion;
        }
    }

    throw new Error(`Podfile '${absolutePath}' doesn't contain COCOAPODS version.`);
};

