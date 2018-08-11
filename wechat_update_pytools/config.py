# -*- coding:utf-8 -*-

import os
from makeZip import fshelper


VERSION_NUM = "1.0.6"
VERSION_NAME = "1_0_6"

FILE_NAME = 'versionStore'

NEED_PACK_PATH = "raw-assets/resources"

GAMES_PATH = fshelper.getAbsFromRelative(__file__, '.', FILE_NAME)
TEMP_PATH = fshelper.getAbsFromRelative(__file__, '.', 'tempFile')
ZIP_PATH = fshelper.getAbsFromRelative(__file__, '..', FILE_NAME, VERSION_NAME)
RES_PATH = fshelper.getAbsFromRelative(__file__, '..', 'build',"wechatgame/res/"+NEED_PACK_PATH)

NOPACK_FILES = {
    'update'
}

def getJsonText():
    return '{\n\
    "version" : "%s",\n\
    "updateFile" : "%s"\n\
}'% (VERSION_NUM,VERSION_NAME+".zip")



