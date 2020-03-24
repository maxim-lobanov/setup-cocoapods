import * as core from "@actions/core";
import { CocoapodsInstaller } from "./installer";

const run = async (): Promise<void> => {
    try {
        if (process.platform !== "darwin" && process.platform !== "linux") {
            throw new Error(`This task is intended for macOS and linux platforms. It can't be run on '${process.platform}' platform`);
        }

        let versionSpec = core.getInput("version", { required: false });
        const podfilePath = core.getInput("podfile-path", { required: false });

        if (!!versionSpec === !!podfilePath) {
            throw new Error("Invalid input parameters usage. Only 'version' or 'podfile-path' should be defined");
        }

        if (!versionSpec) {
            core.debug("Reading Podfile to determine the version of Cocoapods...");
            versionSpec = CocoapodsInstaller.getVersionFromPodfile(podfilePath);
            core.info(`Podfile points to the Cocoapods ${versionSpec}`);
        }

        await CocoapodsInstaller.install(versionSpec);
    } catch (error) {
        core.setFailed(error.message);
    }
};

run();
